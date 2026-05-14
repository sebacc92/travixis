import { component$ } from "@builder.io/qwik";
import logoSrc from "~/media/logo2.svg";

export const Footer = component$(() => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      class="bg-[#01254f] text-white"
      aria-labelledby="footer-heading"
    >
      {/* Main footer content */}
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div class="md:col-span-1">
            <div class="mb-6">
              <img
                src={logoSrc}
                alt="Travixis Logo"
                width={120}
                height={120}
                class="h-14 w-auto object-contain"
              />
            </div>
            <p class="text-white/50 text-sm leading-relaxed max-w-xs">
              Tu asistencia de viaje de confianza. Estés donde estés, estamos con vos.
            </p>
          </div>

          {/* Links column */}
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">
              Coberturas
            </h3>
            <ul class="flex flex-col gap-3">
              {[
                "Emergencias Médicas",
                "Reintegro de Medicamentos",
                "Pérdida de Equipaje",
                "Asistencia 24/7",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#cobertura"
                    class="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div id="contacto-info">
            <h3 class="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">
              Contacto
            </h3>
            <ul class="flex flex-col gap-4">
              <li>
                <a
                  href="tel:+5491150532300"
                  class="flex items-center gap-3 group"
                  aria-label="Llamar al número de emergencias"
                >
                  <span class="flex items-center justify-center w-9 h-9 bg-[#C8102E] rounded-lg flex-shrink-0 group-hover:bg-[#a50d25] transition-colors">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-white/40 text-xs">Emergencias 24/7</p>
                    <p class="text-white font-semibold text-sm group-hover:text-[#C8102E] transition-colors">
                      54 9 11 5053-2300
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@travixis.com.ar"
                  class="flex items-center gap-3 group"
                  aria-label="Enviar correo a Travixis"
                >
                  <span class="flex items-center justify-center w-9 h-9 bg-white/10 rounded-lg flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-white/40 text-xs">Consultas generales</p>
                    <p class="text-white font-semibold text-sm group-hover:text-white/80 transition-colors uppercase">
                      INFO@TRAVIXIS.COM.AR
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div class="border-t border-white/10">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/30 text-xs text-center sm:text-left leading-relaxed">
            © {year} Travixis Travel Care. Servicio prestado por{" "}
            <strong class="text-white/40">Universal Assistance S.A.</strong> Av. Córdoba 967 (C1054AAI) Buenos Aires. Argentina.
          </p>
          <p class="text-white/20 text-xs whitespace-nowrap">
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});
