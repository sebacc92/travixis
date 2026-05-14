import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useSendContactEmail } from "~/routes/index";

// Definimos la interfaz para window.turnstile para TypeScript
declare global {
  interface Window {
    turnstile: any;
  }
}

export const Contact = component$(() => {
  const action = useSendContactEmail();
  const containerRef = useSignal<HTMLElement>();
  // Usamos un signal para guardar el token explícitamente
  const turnstileToken = useSignal('');

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => containerRef.value);

    if (typeof window === 'undefined' || !containerRef.value) return;

    // Función para renderizar el widget
    const renderWidget = () => {
      if (window.turnstile) {
        window.turnstile.render(containerRef.value, {
          sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: function (token: string) {
            turnstileToken.value = token;
          },
          'expired-callback': function () {
            turnstileToken.value = ''; // Limpiar si expira
          },
        });
      }
    };

    // Inyectar el script si no existe
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      // Si ya existe (ej. navegación SPA), solo renderizamos
      renderWidget();
    }
  });

  return (
    <section id="contacto-form" class="py-24 bg-white relative overflow-hidden">
      <div class="max-w-[1600px] mx-auto px-6 w-full relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Lado Izquierdo: Mensaje de Tranquilidad y Badge */}
          <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Badge 24x365 */}
            <div class="relative mb-10 group">
              {/* Resplandor de fondo */}
              <div class="absolute inset-0 bg-gradient-to-r from-[#01254f]/20 to-[#C8102E]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              
              {/* Círculo Principal */}
              <div class="relative w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-[#01254f] to-[#0a1532] rounded-full flex flex-col items-center justify-center border-4 border-white shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-105">
                {/* Acento rojo interno */}
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-[#C8102E] rounded-full blur-2xl opacity-60"></div>
                
                <div class="relative z-10 flex flex-col items-center">
                  <span class="font-display text-7xl sm:text-8xl text-white leading-none tracking-tighter">
                    24<span class="text-[#C8102E] text-5xl">x</span>
                  </span>
                  <span class="font-display text-4xl sm:text-5xl text-white/90 leading-none tracking-widest mt-1">
                    365
                  </span>
                </div>
              </div>
            </div>

            {/* Texto debajo del badge */}
            <h2 class="font-display text-3xl sm:text-5xl lg:text-6xl text-[#01254f] font-bold leading-[1.1] mb-6 uppercase">
              Tranquilidad las<br/>
              <span class="text-[#C8102E]">24 Hs.</span> los <span class="text-[#C8102E]">365 días</span><br/>
              del año.
            </h2>
            <p class="font-body text-xl text-slate-500 font-light max-w-md">
              Nuestro centro de atención global nunca duerme. Donde sea que vayas, estamos ahí para cuidarte.
            </p>
          </div>

          {/* Lado Derecho: Formulario de Contacto */}
          <div class="w-full">
            <div class="bg-slate-50 rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-slate-100 relative">
              {/* Título del Formulario */}
              <div class="mb-10 text-center lg:text-left">
                <h3 class="font-display text-3xl sm:text-4xl text-[#01254f] font-bold uppercase mb-3">
                  Consultá por nuestros planes de asistencia internacional.
                </h3>
                <p class="font-body text-slate-600 text-lg">
                  Para más información contactanos.
                </p>
              </div>

              {action.value?.success ? (
                <div class="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 class="font-display text-3xl font-bold text-[#01254f] mb-3 uppercase">¡Mensaje Enviado!</h4>
                  <p class="font-body text-slate-500 text-lg">
                    Gracias por contactarnos. Un asesor se comunicará contigo a la brevedad.
                  </p>
                </div>
              ) : (
                <Form class="space-y-6" action={action}>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-body font-semibold text-[#01254f] mb-2 uppercase tracking-wide">Nombre y Apellido</label>
                      <input
                        name="nombre"
                        type="text"
                        placeholder="Ingresá tu nombre"
                        class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-all duration-300 font-body text-lg shadow-sm"
                      />
                      {action.value?.fieldErrors?.nombre && <p class="text-[#C8102E] text-sm mt-2 font-medium">{action.value.fieldErrors.nombre}</p>}
                    </div>
                    <div>
                      <label class="block text-sm font-body font-semibold text-[#01254f] mb-2 uppercase tracking-wide">Correo Electrónico</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-all duration-300 font-body text-lg shadow-sm"
                      />
                      {action.value?.fieldErrors?.email && <p class="text-[#C8102E] text-sm mt-2 font-medium">{action.value.fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-body font-semibold text-[#01254f] mb-2 uppercase tracking-wide">Tu Mensaje</label>
                    <textarea
                      name="mensaje"
                      rows={4}
                      placeholder="Contanos a dónde viajás y cuántos días..."
                      class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-all duration-300 font-body text-lg resize-none shadow-sm"
                    ></textarea>
                    {action.value?.fieldErrors?.mensaje && <p class="text-[#C8102E] text-sm mt-2 font-medium">{action.value.fieldErrors.mensaje}</p>}
                  </div>

                  {/* Global Error Message */}
                  {action.value?.failed && (
                    <div class="bg-[#C8102E]/10 border border-[#C8102E]/20 text-[#C8102E] px-4 py-3 rounded-xl text-sm font-medium">
                      {action.value.message}
                    </div>
                  )}

                  {/* Turnstile Widget */}
                  <div class="min-h-[65px] flex justify-center lg:justify-start">
                    <div ref={containerRef}></div>
                  </div>
                  <input type="hidden" name="cf-turnstile-response" value={turnstileToken.value} />

                  <button
                    type="submit"
                    disabled={action.isRunning || !turnstileToken.value}
                    class="w-full bg-[#01254f] hover:bg-[#C8102E] text-white font-heading font-bold text-lg uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-[#01254f]/20 hover:shadow-[#C8102E]/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    {action.isRunning ? (
                      <>
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      "Enviar Mensaje"
                    )}
                  </button>
                </Form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
