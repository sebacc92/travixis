import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z, type DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { ServicesStrip } from "~/components/landing/ServicesStrip";
import { AboutSection } from "~/components/landing/AboutSection";
import { BenefitsGrid } from "~/components/landing/BenefitsGrid";
import { CoverageSection } from "~/components/landing/CoverageSection";
import { Footer } from "~/components/landing/Footer";
import { WhatsAppButton } from "~/components/ui/whatsapp-button";
import { Chatbot } from "~/components/ui/chatbot";
import { SitePopup } from "~/components/ui/site-popup";
import { getDb } from "~/db";
import { siteSettings } from "~/db/schema";
import { eq } from "drizzle-orm";
import { Contact } from "~/components/landing/Contact";

export const useSendContactEmail = routeAction$(async (datos, { env, fail, request }) => {
  const token = (datos as any)['cf-turnstile-response'];

  if (!token) {
    return fail(400, { message: 'Por favor, completa la verificación de seguridad.' });
  }

  const secretKey = env.get('TURNSTILE_SECRET_KEY');
  if (!secretKey) {
    console.error('Falta TURNSTILE_SECRET_KEY en .env.local');
    return fail(500, { message: 'Error de configuración del servidor' });
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
  if (ip) formData.append('remoteip', ip);

  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verifyResult = await verifyResponse.json();
    if (!verifyResult.success) {
      console.error('Turnstile verification failed:', verifyResult);
      return fail(400, { message: 'Verificación de seguridad fallida. Intenta nuevamente.' });
    }
  } catch (e) {
    console.error('Error contacting Turnstile API:', e);
    return fail(500, { message: 'Error de conexión con el servicio de seguridad.' });
  }

  const apiKey = env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('Falta la API Key de Resend en .env.local');
    return fail(500, { message: 'Error de configuración del servidor' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'services@travixis.com.ar', // Cambiar a la direccion de travixis en produccion
        subject: `Nuevo contacto desde la web de Travixis: ${datos.nombre}`,
        html: `
                    <h1>Nuevo mensaje desde la Landing de Travixis</h1>
                    <p><strong>Nombre:</strong> ${datos.nombre}</p>
                    <p><strong>Email del prospecto:</strong> ${datos.email}</p>
                    <p><strong>Mensaje:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #01254f;">
                    ${datos.mensaje}
                    </blockquote>
                `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Resend API:', errorData);
      return fail(500, { message: 'No se pudo enviar el correo en este momento.' });
    }

    return { success: true };

  } catch (error) {
    console.error('Error interno al enviar email:', error);
    return fail(500, { message: 'Ocurrió un error inesperado al enviar el mensaje.' });
  }
}, zod$({
  nombre: z.string().min(2, 'Tu nombre es muy corto'),
  email: z.string().email('Ingresa un email válido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  'cf-turnstile-response': z.string().optional()
}));

export const useSiteSettings = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return settings || null;
});

export default component$(() => {
  const settings = useSiteSettings();

  return (
    <>
      <Navbar />
      <main class="flex flex-col overflow-hidden">
        <Hero
          title1={settings.value?.homeTitle1}
          title2={settings.value?.homeTitle2}
          subtitle={settings.value?.homeSubtitle}
          whatsappNumber={settings.value?.whatsappNumber}
        />
        <ServicesStrip />
        <AboutSection />
        <BenefitsGrid />
        <CoverageSection />
        <Contact />
      </main>
      <Footer />

      <WhatsAppButton
        phone={settings.value?.whatsappNumber || undefined}
      />

      {settings.value?.aiEnabled !== false && (
        <Chatbot avatarUrl={settings.value?.aiAvatarUrl || undefined} />
      )}

      {settings.value?.popupEnabled && (
        <SitePopup
          imageUrl={settings.value?.popupImageUrl}
          title={settings.value?.popupTitle}
          description={settings.value?.popupDescription}
          ctaText={settings.value?.popupCtaText}
          ctaLink={settings.value?.popupCtaLink}
        />
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Travixis Travel Care – Asistencia al viajero 24/7",
  meta: [
    {
      name: "description",
      content:
        "Viajar con respaldo real. Emergencias médicas, reintegro de medicamentos y cobertura de equipaje. Llamá al 54 9 11 5053-2300.",
    },
    {
      name: "keywords",
      content:
        "asistencia al viajero, emergencias médicas, cobertura viaje, travixis, universal assistance",
    },
    { property: "og:title", content: "Travixis Travel Care" },
    {
      property: "og:description",
      content: "Tu asistencia, estés donde estés. Cobertura integral durante el viaje.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
};
