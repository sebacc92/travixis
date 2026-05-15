import { BRAND_COLORS } from "~/constants/brand";

export interface ContactFormData {
  nombre: string;
  email: string;
  mensaje: string;
}

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string | null,
): Promise<{ success: true } | { success: false; message: string }> {
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (remoteIp) formData.append("remoteip", remoteIp);

  try {
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData },
    );
    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      console.error("Turnstile verification failed:", verifyResult);
      return {
        success: false,
        message: "Verificación de seguridad fallida. Intenta nuevamente.",
      };
    }

    return { success: true };
  } catch (e) {
    console.error("Error contacting Turnstile API:", e);
    return {
      success: false,
      message: "Error de conexión con el servicio de seguridad.",
    };
  }
}

export async function sendContactEmail(
  datos: ContactFormData,
  apiKey: string,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "services@travixis.com.ar",
        subject: `Nuevo contacto desde la web de Travixis: ${datos.nombre}`,
        html: `
          <h1>Nuevo mensaje desde la Landing de Travixis</h1>
          <p><strong>Nombre:</strong> ${datos.nombre}</p>
          <p><strong>Email del prospecto:</strong> ${datos.email}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid ${BRAND_COLORS.navy};">
            ${datos.mensaje}
          </blockquote>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Resend API:", errorData);
      return {
        success: false,
        message: "No se pudo enviar el correo en este momento.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error interno al enviar email:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al enviar el mensaje.",
    };
  }
}
