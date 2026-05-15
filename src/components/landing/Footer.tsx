import { component$ } from "@builder.io/qwik";
import logoSrc from "~/media/logo2.svg";
import { CONTACT } from "~/constants/contact";
import { FOOTER_COVERAGE_LINKS } from "~/data/footer-links";
import { SectionContainer } from "./SectionContainer";
import { PhoneIcon } from "./PhoneIcon";

export const Footer = component$(() => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      class="bg-brand-navy text-white"
      aria-labelledby="footer-heading"
    >
      {/* Main footer content */}
      <SectionContainer padding="responsive" class="py-16">
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
              {FOOTER_COVERAGE_LINKS.map((item) => (
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
                  href={CONTACT.phoneTel}
                  class="flex items-center gap-3 group"
                  aria-label="Llamar al número de emergencias"
                >
                  <span class="flex items-center justify-center w-9 h-9 bg-brand-red rounded-lg flex-shrink-0 group-hover:bg-brand-red-hover transition-colors">
                    <PhoneIcon class="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <p class="text-white/40 text-xs">Emergencias 24/7</p>
                    <p class="text-white font-semibold text-sm group-hover:text-brand-red transition-colors">
                      {CONTACT.phoneDisplay}
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
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
                      {CONTACT.emailDisplay}
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>

      {/* Legal bar */}
      <div class="border-t border-white/10">
        <SectionContainer padding="responsive" class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/30 text-xs text-center sm:text-left leading-relaxed">
            © {year} Travixis Travel Care. Servicio prestado por{" "}
            <strong class="text-white/40">Universal Assistance S.A.</strong> Av. Córdoba 967 (C1054AAI) Buenos Aires. Argentina.
          </p>
          <p class="text-white/20 text-xs whitespace-nowrap">
            Todos los derechos reservados.
          </p>
        </SectionContainer>
      </div>
    </footer>
  );
});
