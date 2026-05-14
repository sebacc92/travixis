import { component$ } from "@builder.io/qwik";

export const ServicesStrip = component$(() => {
  const services = [
    { 
      title: "Respuesta rápida ante emergencias", 
      icon: "M13 10V3L4 14h7v7l9-11h-7z" 
    },
    { 
      title: "Coordinación médica profesional", 
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
    },
    { 
      title: "Cobertura integral durante el viaje", 
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    },
    { 
      title: "Apoyo al viajero en situaciones críticas", 
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" 
    },
    { 
      title: "Asistencia continua durante la vigencia del plan", 
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
    },
  ];

  return (
    <section class="py-16 bg-gradient-to-b from-white to-[#01254f]/5">
      <div class="max-w-[1600px] mx-auto px-6 w-full">
        <h2 class="text-center font-display text-2xl md:text-3xl lg:text-4xl text-[#01254f] font-bold mb-12 uppercase tracking-tight">
          La asistencia al viajero es mucho más que un seguro de viaje:
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div key={index} class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group border border-[#01254f]/5">
              <div class="w-24 h-24 relative mb-6 flex items-center justify-center">
                {/* Círculo de fondo con los colores de la marca */}
                <div class="absolute inset-0 bg-gradient-to-t from-[#01254f]/10 to-transparent rounded-full group-hover:from-[#C8102E]/10 transition-colors duration-500"></div>
                <svg class="w-10 h-10 text-[#01254f] group-hover:text-[#C8102E] relative z-10 transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d={service.icon} />
                </svg>
              </div>
              <h3 class="font-heading text-sm md:text-base font-bold text-[#01254f] group-hover:text-[#C8102E] transition-colors duration-300 leading-snug">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
