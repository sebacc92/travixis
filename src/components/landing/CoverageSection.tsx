import { component$ } from "@builder.io/qwik";
import { COVERAGES } from "~/data/coverages";
import { SectionContainer } from "./SectionContainer";

export const CoverageSection = component$(() => {
  return (
    <section
      id="cobertura"
      class="relative py-24 bg-white overflow-hidden"
    >
      <SectionContainer padding="responsive">

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

      </SectionContainer>
    </section>
  );
});
