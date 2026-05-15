import { component$ } from "@builder.io/qwik";
import { CONTACT } from "~/constants/contact";
import { TRUST_BADGES } from "~/data/trust-badges";
import { SectionContainer } from "./SectionContainer";
import { SectionBadge } from "./SectionBadge";
import { PhoneIcon } from "./PhoneIcon";

interface HeroProps {
  title1?: string;
  title2?: string;
  subtitle?: string;
  whatsappNumber?: string;
}

export const Hero = component$<HeroProps>(({ title1, title2, subtitle, whatsappNumber }) => {
  return (
    <section
      id="inicio"
      class="relative flex items-center justify-center bg-white pt-32 pb-0 overflow-hidden lg:min-h-[85vh]"
      aria-labelledby="hero-heading"
    >
      <SectionContainer class="relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-4 items-center">

          {/* Lado Izquierdo: Texto */}
          <div class="flex flex-col items-start text-left lg:pl-12">
            {/* Badge */}
            <SectionBadge label="Asistencia disponible 24/7" variant="navy" class="mb-8" />

            {/* Título Principal */}
            <h1
              id="hero-heading"
              class="font-display text-7xl sm:text-8xl lg:text-[110px] text-brand-navy leading-[0.9] uppercase mb-6"
            >
              {title1 || "VIAJAR CON"}<br />
              <span class="text-brand-red">{title2 || "RESPALDO REAL"}</span>
            </h1>

            {/* Subtítulo */}
            <p class="font-body text-xl sm:text-2xl text-slate-600 font-light leading-relaxed mb-12 max-w-lg whitespace-pre-line">
              {(() => {
                const content = subtitle || "Tu asistencia, estés donde estés.\nEmergencias, médicos y equipaje — cubierto en todo momento.";
                const parts = content.split('\n');
                if (parts.length > 1) {
                  return (
                    <>
                      {parts[0]}<br />
                      <span class="font-normal text-brand-navy/70">{parts.slice(1).join('\n')}</span>
                    </>
                  );
                }
                return content;
              })()}
            </p>

            {/* Call to Action Crítico (Rojo + Glassmorphism) */}
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={`tel:+${whatsappNumber || CONTACT.phoneE164}`}
                id="hero-emergency-cta"
                class="group flex items-center gap-4 bg-brand-red/95 backdrop-blur-md hover:bg-brand-red-hover text-white font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-brand-red/30 transition-all duration-300 hover:scale-105 hover:shadow-brand-red/50"
                aria-label="Llamar al número de emergencias"
              >
                <span class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <PhoneIcon class="w-6 h-6" />
                </span>
                <div class="text-left">
                  <div class="text-sm text-white/90 font-normal leading-none mb-1">Llamar a Emergencias</div>
                  <div class="font-display tracking-widest text-3xl leading-none">{whatsappNumber || CONTACT.phoneE164}</div>
                </div>
              </a>
            </div>

            {/* Indicadores de confianza */}
            <div class="flex flex-wrap items-center gap-8 mt-12">
              {TRUST_BADGES.map((item) => (
                <div key={item.label} class="flex items-center gap-2 text-brand-navy/70">
                  <span class="text-2xl">{item.icon}</span>
                  <span class="font-body text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Lado Derecho: Imagen con contenedor flotante */}
          <div class="relative w-full h-full min-h-[500px] lg:min-h-[800px] flex items-center justify-center group">
            <img
              src="/hero-travixis.webp"
              alt="Familia viajando protegida por Travixis"
              class="absolute inset-0 w-full h-full object-cover lg:object-right transition-transform duration-700 group-hover:scale-[1.02] [mask-image:linear-gradient(to_right,transparent,black_20%)]"
            />
            
            {/* Badge flotante sobre la imagen */}
            <div class="absolute bottom-12 left-0 lg:left-10 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-brand-navy/10 border border-slate-100 transition-all duration-300 hover:-translate-y-2 max-w-xs sm:max-w-sm">
              <div class="flex items-center gap-5">
                <div class="flex-shrink-0 w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p class="font-heading text-lg text-brand-navy font-bold leading-tight">Cobertura Global</p>
                  <p class="font-body text-sm text-slate-500 mt-1">Protección integral en más de 150 países.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </SectionContainer>
    </section>
  );
});
