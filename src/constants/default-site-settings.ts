import type { InferSelectModel } from "drizzle-orm";
import { siteSettings } from "~/db/schema";
import { CONTACT } from "~/constants/contact";

export const SITE_SETTINGS_ID = 1;

export type SiteSettings = InferSelectModel<typeof siteSettings>;

/** Full row fallback — matches schema defaults and admin seed values */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: SITE_SETTINGS_ID,
  homeTitle1: "VIAJAR CON",
  homeTitle2: "RESPALDO REAL",
  homeSubtitle:
    "Tu asistencia, estés donde estés.\nEmergencias, médicos y equipaje — cubierto en todo momento.",
  aiEnabled: true,
  aiTone: "Amigable, profesional, transmitiendo seguridad y confianza",
  aiInstructions:
    "1. TRATO NEUTRO Y RESPETUOSO.\n2. Si hay una emergencia médica real, diles inmediatamente que contacten a la Central Operativa vía WhatsApp.",
  aiKnowledge:
    "- Identidad: Somos Travixis Travel Care. Proveemos asistencia integral al viajero con respuesta inmediata.\n- Cobertura: Válida hasta 60 días continuos por viaje.\n- Emergencias: > 100km de domicilio.",
  aiInitialGreeting: "Hola! Soy el Asistente de Travixis, ¿en qué te puedo ayudar hoy?",
  aiCallToAction:
    "Para emitir tu póliza o en caso de emergencia, escribinos urgente a nuestro WhatsApp:",
  whatsappNumber: CONTACT.phoneE164,
  aiAvatarUrl: null,
  popupEnabled: false,
  popupImageUrl: null,
  popupTitle: "Viaja Seguro",
  popupDescription: "Aprovecha nuestras coberturas integrales sin deducibles.",
  popupCtaText: "Cotizar Ahora",
  popupCtaLink: `https://wa.me/${CONTACT.phoneE164}`,
  updatedAt: null,
};
