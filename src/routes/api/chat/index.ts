import { type RequestHandler } from '@builder.io/qwik-city';
import { getDb } from '~/db';
import { siteSettings, chatSessions, chatMessages } from '~/db/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

export const onPost: RequestHandler = async (requestEvent) => {
  try {
    const { request, env, json } = requestEvent;

    const db = getDb(env);
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

    if (settings && !settings.aiEnabled) {
      json(403, { error: 'El Chatbot se encuentra deshabilitado actualmente.' });
      return;
    }

    const body = await request.json();
    if (!body || !body.messages) {
      json(400, { error: 'Faltan mensajes en la petición.' });
      return;
    }

    const { messages, sessionId } = body;

    if (sessionId) {
      // Registrar sesión y mensajes en DB
      try {
        await db.insert(chatSessions).values({
          id: sessionId,
          createdAt: new Date(),
          lastActive: new Date()
        }).onConflictDoUpdate({
          target: chatSessions.id,
          set: { lastActive: new Date() }
        });

        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
          await db.insert(chatMessages).values({
            id: 'msg-' + Date.now().toString() + Math.floor(Math.random() * 1000),
            sessionId: sessionId,
            role: 'user',
            content: lastUserMessage.content,
            createdAt: new Date()
          });
        }
      } catch (dbErr) {
        console.error('Error guardando en BD (silenciado)', dbErr);
      }
    }

    // System prompt específico de Travixis
    const systemPrompt = `${settings?.aiInitialGreeting || 'Hola! Soy el Asistente de Travixis, ¿en qué te puedo ayudar hoy?'}

CONOCIMIENTO DE TRAVIXIS TRAVEL CARE:
${settings?.aiKnowledge || '- Identidad: Somos Travixis Travel Care. Proveemos asistencia integral al viajero con respuesta inmediata.\n- Cobertura: Válida hasta 60 días continuos por viaje.\n- Emergencias: La cobertura aplica cuando estás a más de 100km de tu domicilio.\n- Medicamentos: Tienen un reintegro garantizado del 30%.\n- Equipaje: Indemnización de hasta USD 1.200 por pérdida total o USD 40 por kg.'}

INSTRUCCIONES Y REGLAS:
- Tono: ${settings?.aiTone || 'Amigable, profesional, transmitiendo seguridad y confianza'}.
- WhatsApp de Contacto para emergencias y ventas: ${settings?.whatsappNumber || '5491150532300'}.
${settings?.aiInstructions || '1. TRATO NEUTRO Y RESPETUOSO.\n2. Si hay una emergencia médica real, diles inmediatamente que contacten a la Central Operativa vía WhatsApp o teléfono.'}

LLAMADO A LA ACCIÓN:
${settings?.aiCallToAction || 'Para emitir tu póliza o en caso de emergencia, escribinos urgente a nuestro WhatsApp:'} ${settings?.whatsappNumber || '5491150532300'}`;

    const openaiApiKey = env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      json(500, { error: 'API Key de OpenAI no configurada.' });
      return;
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          }))
        ],
        max_tokens: 500,
        temperature: 0.4,
      });

      const replyText = response.choices[0]?.message?.content || 'Lo siento. Tuve un problema para procesar tu mensaje. ¿Podrías intentar de nuevo?';

      if (sessionId) {
        try {
          await db.insert(chatMessages).values({
            id: 'msg-' + Date.now().toString() + Math.floor(Math.random() * 1000),
            sessionId: sessionId,
            role: 'assistant',
            content: replyText,
            createdAt: new Date()
          });
        } catch (dbErr) {
          console.error('Error guardando en BD (silenciado)', dbErr);
        }
      }

      json(200, { reply: { role: 'assistant', content: replyText } });
    } catch (openaiErr: any) {
      console.error('OpenAI Error:', openaiErr);
      json(500, { error: 'Error al contactar con el servicio de IA.' });
    }
  } catch (err: any) {
    console.error('Chatbot error:', err);
    requestEvent.json(500, { error: 'Error inesperado del servidor.' });
  }
};
