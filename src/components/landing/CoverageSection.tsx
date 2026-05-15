import { component$ } from "@builder.io/qwik";

interface CoverageItem {
  type: string;
  title: string;
  rule: string;
  detail: string;
  highlight: string;
  icon: string;
  bullets?: string[];
}

const COVERAGES: CoverageItem[] = [
  {
    type: "medical",
    title: "Asistencia médica (cobertura principal)",
    rule: "Cobertura completa sin pago directo (con coordinación previa)",
    detail: "Incluye atención integral por enfermedad o accidente:",
    highlight: "Cobertura Completa",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    bullets: [
      "Atención médica en consultorio o domicilio",
      "Consultas con especialistas",
      "Estudios y exámenes complementarios",
      "Internaciones clínicas y quirúrgicas",
      "Cirugías",
      "Terapia intensiva y unidad coronaria"
    ]
  },
  {
    type: "transfer",
    title: "Traslados muy amplios",
    rule: "Logística y cuidado en tránsito",
    detail: "Incluye traslados sanitarios, derivaciones, y casos complejos incluyendo acompañamiento de familiares y traslados por fallecimiento.",
    highlight: "Incluye Familiares",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
  {
    type: "dental",
    title: "Odontología",
    rule: "Exclusivo para urgencias",
    detail: "Atención odontológica garantizada solo para urgencias (dolor agudo, infección o trauma) que impidan continuar el viaje.",
    highlight: "Urgencias",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    type: "medication",
    title: "Medicamentos",
    rule: "El usuario abona y luego reclama",
    detail: "Presentá la receta y factura de farmacia y te reintegramos solo el 30% del gasto aprobado. Proceso rápido.",
    highlight: "30% de reintegro",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    type: "baggage",
    title: "Equipaje",
    rule: "Pérdida total por la aerolínea",
    detail: "Indemnización de hasta USD 1.200 por evento en casos de pérdida definitiva del equipaje despachado.",
    highlight: "Hasta USD 1.200",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export const CoverageSection = component$(() => {
  return (
    <section
      id="cobertura"
      class="relative py-24 bg-white overflow-hidden"
    >
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-brand-red/10 rounded-full px-4 py-2 mb-4 hover:scale-105 transition-transform duration-300">
            <span class="w-2 h-2 rounded-full bg-brand-red" aria-hidden="true" />
            <span class="text-brand-red text-sm font-semibold tracking-wide uppercase">Coberturas incluidas</span>
          </div>
          <h2
            id="coverage-heading"
            class="text-4xl sm:text-5xl font-black text-brand-navy-dark leading-tight mb-4"
          >
            ¿Qué cubre tu plan?
          </h2>
          <p class="text-slate-500 text-lg max-w-xl mx-auto">
            Protección integral para que disfrutes de tu viaje con total tranquilidad.
          </p>
        </div>

        {/* Coverage cards */}
        <div class="flex flex-col gap-6">
          {COVERAGES.map((cov, idx) => (
            <article
              key={cov.type}
              class="group flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Index + icon */}
              <div class="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-2">
                <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-navy-dark group-hover:bg-brand-red group-hover:scale-110 transition-all duration-500">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d={cov.icon} />
                  </svg>
                </div>
                <span class="text-4xl font-black text-slate-100 sm:text-3xl group-hover:text-slate-200 transition-colors duration-300">{String(idx + 1).padStart(2, "0")}</span>
              </div>

              {/* Content */}
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start gap-3 mb-2">
                  <h3 class="text-xl font-bold text-brand-navy-dark">{cov.title}</h3>
                  <span class="inline-block bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {cov.highlight}
                  </span>
                </div>
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {cov.rule}
                </p>
                <p class="text-slate-600 leading-relaxed mb-4">{cov.detail}</p>
                
                {cov.bullets && (
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {cov.bullets.map((bullet, i) => (
                      <li key={i} class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-slate-700 text-sm font-medium">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Conditions notes */}
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Condición Clave */}
          <div class="flex items-start gap-4 bg-slate-50 hover:bg-brand-navy-dark/5 transition-colors duration-300 rounded-2xl p-6 border border-slate-100 group">
            <div class="w-10 h-10 rounded-full bg-brand-navy-dark/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-navy-dark transition-colors duration-300">
              <span class="text-brand-navy-dark font-bold group-hover:text-white">*</span>
            </div>
            <div>
              <h4 class="font-bold text-brand-navy-dark mb-2 uppercase text-sm tracking-wide">Condición clave:</h4>
              <p class="text-slate-600 text-sm leading-relaxed">
                Cubre únicamente cuando el evento ocurre a <strong class="text-brand-navy-dark">más de 100 km</strong> del domicilio habitual.
                Límite de <strong class="text-brand-navy-dark">60 días por viaje</strong>.
              </p>
            </div>
          </div>

          {/* Funcionamiento */}
          <div class="flex items-start gap-4 bg-slate-50 hover:bg-brand-red/5 transition-colors duration-300 rounded-2xl p-6 border border-slate-100 group">
            <div class="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red transition-colors duration-300">
              <span class="text-brand-red font-bold group-hover:text-white">*</span>
            </div>
            <div>
              <h4 class="font-bold text-brand-red mb-2 uppercase text-sm tracking-wide">Funcionamiento:</h4>
              <p class="text-slate-600 text-sm leading-relaxed">
                No se paga nada en el momento. El socio debe <strong class="text-brand-navy-dark">comunicarse para la atención inmediata</strong>, y se deriva según la gravedad del caso.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
});
