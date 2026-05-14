import { component$ } from "@builder.io/qwik";

interface CoverageItem {
  type: string;
  title: string;
  rule: string;
  detail: string;
  highlight: string;
  icon: string;
}

const COVERAGES: CoverageItem[] = [
  {
    type: "medical",
    title: "Emergencia Médica",
    rule: "A más de 100 km del domicilio",
    detail: "Cobertura total sin copago desde el primer peso. Coordinación de traslados, hospitalizaciones y seguimiento médico en destino.",
    highlight: "Sin copago inicial",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    type: "medication",
    title: "Reintegro de Medicamentos",
    rule: "El usuario abona y luego reclama",
    detail: "Presentá la factura de la farmacia y reintegramos el 30 % del gasto aprobado. Proceso 100 % digital desde la app.",
    highlight: "30 % de reintegro",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    type: "baggage",
    title: "Pérdida de Equipaje",
    rule: "Pérdida total por la aerolínea",
    detail: "Indemnización de hasta USD 1.200 por evento, o USD 40 por kg del equipaje perdido, el mayor de los dos valores.",
    highlight: "Hasta USD 1.200",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export const CoverageSection = component$(() => {
  return (
    <section
      id="cobertura"
      class="py-24 bg-slate-50"
      aria-labelledby="coverage-heading"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-[#C8102E]/10 rounded-full px-4 py-2 mb-4">
            <span class="w-2 h-2 rounded-full bg-[#C8102E]" aria-hidden="true" />
            <span class="text-[#C8102E] text-sm font-semibold tracking-wide uppercase">Coberturas incluidas</span>
          </div>
          <h2
            id="coverage-heading"
            class="text-4xl sm:text-5xl font-black text-[#0D1B3E] leading-tight mb-4"
          >
            ¿Qué cubre tu plan?
          </h2>
          <p class="text-slate-500 text-lg max-w-xl mx-auto">
            Cobertura anual con hasta <strong class="text-[#0D1B3E]">60 días por viaje</strong>.
            Sin límite de viajes durante el año.
          </p>
        </div>

        {/* Coverage cards */}
        <div class="flex flex-col gap-6">
          {COVERAGES.map((cov, idx) => (
            <article
              key={cov.type}
              class="group flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Index + icon */}
              <div class="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-2">
                <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-[#0D1B3E] group-hover:bg-[#C8102E] transition-colors duration-300">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d={cov.icon} />
                  </svg>
                </div>
                <span class="text-4xl font-black text-slate-100 sm:text-3xl">{String(idx + 1).padStart(2, "0")}</span>
              </div>

              {/* Content */}
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start gap-3 mb-2">
                  <h3 class="text-xl font-bold text-[#0D1B3E]">{cov.title}</h3>
                  <span class="inline-block bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {cov.highlight}
                  </span>
                </div>
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {cov.rule}
                </p>
                <p class="text-slate-600 leading-relaxed">{cov.detail}</p>
              </div>

              {/* Arrow */}
              <div class="hidden sm:flex items-center flex-shrink-0">
                <svg class="w-5 h-5 text-slate-300 group-hover:text-[#C8102E] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          ))}
        </div>

        {/* Plan validity note */}
        <div class="mt-8 flex items-start gap-3 bg-[#0D1B3E]/5 rounded-xl p-5 border border-[#0D1B3E]/10">
          <svg class="w-5 h-5 text-[#0D1B3E] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-[#0D1B3E]/70 text-sm leading-relaxed">
            <strong class="text-[#0D1B3E]">Vigencia:</strong> Los planes son anuales con un límite máximo de{" "}
            <strong class="text-[#0D1B3E]">60 días corridos por cada viaje</strong>. Las emergencias médicas
            aplican únicamente cuando el viajero se encuentra a más de{" "}
            <strong class="text-[#0D1B3E]">100 km de su domicilio habitual</strong>.
          </p>
        </div>
      </div>
    </section>
  );
});
