import { component$ } from "@builder.io/qwik";

interface Benefit {
  icon: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  color: string;
  bgColor: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Respuesta Rápida ante Emergencias",
    description:
      "Activamos la asistencia en minutos. Coordinamos traslados, internaciones y atención médica urgente sin que tengas que preocuparte por los trámites.",
    stat: "< 10 min",
    statLabel: "Tiempo de respuesta promedio",
    color: "#C8102E",
    bgColor: "#fef2f2",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Coordinación Médica Profesional",
    description:
      "Médicos de guardia disponibles las 24 horas. Gestionamos hospitalizaciones, traslados sanitarios y reintegros de gastos médicos en destino.",
    stat: "24 / 7",
    statLabel: "Médicos de guardia disponibles",
    color: "#0D1B3E",
    bgColor: "#eff6ff",
  },
  {
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
    title: "Cobertura Integral Durante el Viaje",
    description:
      "Emergencias médicas, reintegro de medicamentos al 30 % e indemnización por pérdida de equipaje hasta USD 1.200. Todo en un solo plan anual.",
    stat: "USD 1.200",
    statLabel: "Indemnización máxima por equipaje",
    color: "#059669",
    bgColor: "#f0fdf4",
  },
];

export const BenefitsGrid = component$(() => {
  return (
    <section
      id="beneficios"
      class="py-24 bg-white"
      aria-labelledby="benefits-heading"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-[#0D1B3E]/5 rounded-full px-4 py-2 mb-4">
            <span class="w-2 h-2 rounded-full bg-[#C8102E]" aria-hidden="true" />
            <span class="text-[#0D1B3E] text-sm font-semibold tracking-wide uppercase">¿Por qué elegirnos?</span>
          </div>
          <h2
            id="benefits-heading"
            class="text-4xl sm:text-5xl font-black text-[#0D1B3E] leading-tight mb-4"
          >
            Tu seguridad es nuestra
            <br />
            <span class="text-[#C8102E]">prioridad número uno</span>
          </h2>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto">
            Tres pilares diseñados para que viajes con total tranquilidad, sin importar el destino.
          </p>
        </div>

        {/* Benefits Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BENEFITS.map((benefit, idx) => (
            <article
              key={benefit.title}
              class="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Top color accent bar */}
              <div
                class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ backgroundColor: benefit.color }}
                aria-hidden="true"
              />

              {/* Index badge */}
              <span
                class="absolute top-6 right-6 text-6xl font-black opacity-[0.04] select-none"
                style={{ color: benefit.color }}
                aria-hidden="true"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div
                class="flex items-center justify-center w-14 h-14 rounded-xl mb-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: benefit.bgColor }}
                aria-hidden="true"
              >
                <svg
                  class="w-7 h-7"
                  fill="none"
                  stroke={benefit.color}
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d={benefit.icon} />
                </svg>
              </div>

              {/* Text */}
              <h3 class="text-xl font-bold text-[#0D1B3E] mb-3 leading-tight">
                {benefit.title}
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
                {benefit.description}
              </p>

              {/* Stat */}
              <div class="mt-auto pt-6 border-t border-slate-100">
                <p
                  class="text-3xl font-black"
                  style={{ color: benefit.color }}
                >
                  {benefit.stat}
                </p>
                <p class="text-slate-400 text-xs font-medium mt-1">
                  {benefit.statLabel}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div class="mt-16 rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a3a7a] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p class="text-white font-bold text-xl mb-1">¿Necesitás asistencia ahora?</p>
            <p class="text-white/60 text-sm">Nuestros agentes están disponibles las 24 horas del día, los 365 días del año.</p>
          </div>
          <a
            href="tel:+5491150532300"
            id="benefits-emergency-cta"
            class="flex-shrink-0 flex items-center gap-3 bg-[#C8102E] hover:bg-[#a50d25] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/30 whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"/>
            </svg>
            54 9 11 5053-2300
          </a>
        </div>
      </div>
    </section>
  );
});
