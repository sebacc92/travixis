import { routeAction$, zod$, z } from "@builder.io/qwik-city";
import {
  sendContactEmail,
  verifyTurnstileToken,
} from "~/server/contact-email";

export const useSendContactEmail = routeAction$(
  async (datos, { env, fail, request }) => {
    const token = (datos as Record<string, string>)["cf-turnstile-response"];

    if (!token) {
      return fail(400, {
        message: "Por favor, completa la verificación de seguridad.",
      });
    }

    const secretKey = env.get("TURNSTILE_SECRET_KEY");
    if (!secretKey) {
      console.error("Falta TURNSTILE_SECRET_KEY en .env.local");
      return fail(500, { message: "Error de configuración del servidor" });
    }

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip");

    const turnstile = await verifyTurnstileToken(token, secretKey, ip);
    if (!turnstile.success) {
      return fail(turnstile.message.includes("fallida") ? 400 : 500, {
        message: turnstile.message,
      });
    }

    const apiKey = env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("Falta la API Key de Resend en .env.local");
      return fail(500, { message: "Error de configuración del servidor" });
    }

    const result = await sendContactEmail(datos, apiKey);
    if (!result.success) {
      return fail(500, { message: result.message });
    }

    return { success: true };
  },
  zod$({
    nombre: z.string().min(2, "Tu nombre es muy corto"),
    email: z.string().email("Ingresa un email válido"),
    mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
    "cf-turnstile-response": z.string().optional(),
  }),
);
