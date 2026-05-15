import { component$ } from "@builder.io/qwik";
import { COVERAGES } from "~/data/coverages";
import { SectionContainer } from "./SectionContainer";
import { SectionBadge } from "./SectionBadge";
import { CoverageCard } from "./CoverageCard";

export const CoverageSection = component$(() => {
  return (
    <section
      id="cobertura"
      class="relative py-24 bg-white overflow-hidden"
    >
      <SectionContainer padding="responsive">

        {/* Header */}
        <div class="text-center mb-16">
          <SectionBadge label="Coberturas incluidas" variant="red" />
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
            <CoverageCard key={cov.type} coverage={cov} index={idx} />
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
