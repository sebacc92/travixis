import { component$ } from "@builder.io/qwik";
import { SERVICES } from "~/data/services";
import { SectionContainer } from "./SectionContainer";

export const ServicesStrip = component$(() => {
  return (
    <section class="py-16 bg-gradient-to-b from-white to-brand-navy/5">
      <SectionContainer>
        <h2 class="text-center font-display text-2xl md:text-3xl lg:text-4xl text-brand-navy font-bold mb-12 uppercase tracking-tight">
          La asistencia al viajero es mucho más que un seguro de viaje:
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {SERVICES.map((service, index) => (
            <div key={index} class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group border border-brand-navy/5">
              <div class="w-24 h-24 relative mb-6 flex items-center justify-center">
                <div class="absolute inset-0 bg-gradient-to-t from-brand-navy/10 to-transparent rounded-full group-hover:from-brand-red/10 transition-colors duration-500"></div>
                <svg class="w-10 h-10 text-brand-navy group-hover:text-brand-red relative z-10 transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d={service.icon} />
                </svg>
              </div>
              <h3 class="font-heading text-sm md:text-base font-bold text-brand-navy group-hover:text-brand-red transition-colors duration-300 leading-snug">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
});
