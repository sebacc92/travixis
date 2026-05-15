import { eq } from "drizzle-orm";
import type { getDb } from "~/db";
import { siteSettings } from "~/db/schema";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_ID,
  type SiteSettings,
} from "~/constants/default-site-settings";
import { CONTACT } from "~/constants/contact";

export type Db = ReturnType<typeof getDb>;

export async function getSiteSettings(db: Db): Promise<SiteSettings | undefined> {
  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);
  return settings;
}

/** Admin web: return defaults in memory when the row is missing (no insert). */
export async function getSiteSettingsWithDefaults(db: Db): Promise<SiteSettings> {
  return (await getSiteSettings(db)) ?? DEFAULT_SITE_SETTINGS;
}

/** Admin IA: seed the row when missing (preserves previous behavior). */
export async function getOrCreateSiteSettings(db: Db): Promise<SiteSettings> {
  const existing = await getSiteSettings(db);
  if (existing) return existing;

  try {
    await db.insert(siteSettings).values(DEFAULT_SITE_SETTINGS);
  } catch {
    // Row may have been created concurrently
  }

  return (await getSiteSettings(db)) ?? DEFAULT_SITE_SETTINGS;
}

export function buildAiSystemPrompt(settings: SiteSettings | undefined): string {
  const aiKnowledge =
    settings?.aiKnowledge ??
    "- Identidad: Somos Travixis Travel Care. Proveemos asistencia integral al viajero con respuesta inmediata.\n- Cobertura: Válida hasta 60 días continuos por viaje.\n- Emergencias: La cobertura aplica cuando estás a más de 100km de tu domicilio.\n- Medicamentos: Tienen un reintegro garantizado del 30%.\n- Equipaje: Indemnización de hasta USD 1.200 por pérdida total o USD 40 por kg.";

  const aiTone =
    settings?.aiTone ?? "Amigable, profesional, transmitiendo seguridad y confianza";

  const whatsappNumber = settings?.whatsappNumber ?? CONTACT.phoneE164;

  const aiInstructions =
    settings?.aiInstructions ??
    "1. TRATO NEUTRO Y RESPETUOSO.\n2. Si hay una emergencia médica real, diles inmediatamente que contacten a la Central Operativa vía WhatsApp o teléfono.";

  const aiCallToAction =
    settings?.aiCallToAction ??
    "Para emitir tu póliza o en caso de emergencia, escribinos urgente a nuestro WhatsApp:";

  const aiInitialGreeting =
    settings?.aiInitialGreeting ??
    "Hola! Soy el Asistente de Travixis, ¿en qué te puedo ayudar hoy?";

  return `${aiInitialGreeting}

CONOCIMIENTO DE TRAVIXIS TRAVEL CARE:
${aiKnowledge}

INSTRUCCIONES Y REGLAS:
- Tono: ${aiTone}.
- WhatsApp de Contacto para emergencias y ventas: ${whatsappNumber}.
${aiInstructions}

LLAMADO A LA ACCIÓN:
${aiCallToAction} ${whatsappNumber}`;
}
