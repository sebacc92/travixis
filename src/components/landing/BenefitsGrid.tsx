import { component$ } from "@builder.io/qwik";

export const BenefitsGrid = component$(() => {
  return (
    <section
      id="beneficios"
      class="relative py-24 bg-slate-50 overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      <div class="max-w-[1600px] mx-auto px-6 w-full">
        {/* Cabecera de Sección */}
        <div class="mb-16 md:w-2/3">
          <h2
            id="benefits-heading"
            class="font-display text-5xl sm:text-7xl text-[#0D1B3E] leading-none uppercase mb-6"
          >
            NUESTRO COMPROMISO<br />
            <span class="text-[#C8102E]">CON TU SEGURIDAD</span>
          </h2>
          <p class="font-body text-slate-500 text-xl font-light leading-relaxed max-w-2xl">
            Un diseño de cobertura inteligente que prioriza la acción rápida y la protección total, 
            eliminando la burocracia cuando más lo necesitás.
          </p>
        </div>

        {/* Grilla Bento Box Asimétrica */}
        <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 lg:gap-8">
          
          {/* Tarjeta Principal: Cobertura Médica (Ocupa 2 columnas, 2 filas en pantallas medianas) */}
          <div class="group md:col-span-2 md:row-span-2 bg-[#0D1B3E] rounded-3xl p-8 lg:p-12 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
            {/* Acento de fondo sutil */}
            <div class="absolute -right-20 -top-20 w-[400px] h-[400px] bg-[#1a3a7a] rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"></div>
            
            <div class="relative z-10 mb-16">
               <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                 <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </div>
               <h3 class="font-display text-5xl lg:text-6xl text-white uppercase leading-tight mb-6">
                 Cobertura Médica<br />Integral
               </h3>
               <p class="font-body text-white/80 font-light text-xl max-w-md leading-relaxed">
                 Asistencia total sin copago inicial. Gestionamos y cubrimos los gastos médicos en destino, priorizando tu salud por sobre los trámites burocráticos.
               </p>
            </div>

            {/* Métricas gigantes estilo Bento */}
            <div class="relative z-10 flex flex-wrap gap-10 lg:gap-20">
               <div>
                  <div class="font-display text-[5rem] lg:text-[7rem] text-[#C8102E] leading-none mb-2">60</div>
                  <div class="font-heading text-white tracking-widest uppercase text-sm">Días de vigencia</div>
               </div>
               <div>
                  <div class="font-display text-[5rem] lg:text-[7rem] text-[#C8102E] leading-none mb-2">100<span class="text-5xl lg:text-6xl ml-1 text-[#C8102E]/80">km</span></div>
                  <div class="font-heading text-white tracking-widest uppercase text-sm">Distancia de cobertura</div>
               </div>
            </div>
          </div>

          {/* Tarjeta Secundaria 1: Reintegro de Medicamentos */}
          <div class="group bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
             <div>
               <div class="w-14 h-14 bg-[#0D1B3E]/5 rounded-2xl flex items-center justify-center mb-6 text-[#0D1B3E] group-hover:bg-[#0D1B3E] group-hover:text-white transition-colors duration-300">
                 <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
               </div>
               <h3 class="font-heading text-2xl text-[#0D1B3E] font-bold mb-3">Medicamentos</h3>
               <p class="font-body text-slate-600 font-light text-base leading-relaxed mb-8">
                 Reintegro garantizado y rápido para tus recetas de emergencia en el exterior.
               </p>
             </div>
             <div>
                <div class="font-display text-6xl text-[#0D1B3E] leading-none mb-2">30%</div>
                <div class="font-heading text-slate-400 uppercase tracking-widest text-xs">Reintegro del gasto</div>
             </div>
          </div>

          {/* Tarjeta Secundaria 2: Equipaje */}
          <div class="group bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
             <div>
               <div class="w-14 h-14 bg-[#0D1B3E]/5 rounded-2xl flex items-center justify-center mb-6 text-[#0D1B3E] group-hover:bg-[#0D1B3E] group-hover:text-white transition-colors duration-300">
                 <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               </div>
               <h3 class="font-heading text-2xl text-[#0D1B3E] font-bold mb-3">Equipaje</h3>
               <p class="font-body text-slate-600 font-light text-base leading-relaxed mb-8">
                 Indemnización ágil por la pérdida total de tu equipaje despachado en aerolíneas.
               </p>
             </div>
             <div>
                <div class="font-display text-6xl text-[#0D1B3E] leading-none mb-2"><span class="text-4xl text-[#0D1B3E]/70 mr-1">USD</span>1.200</div>
                <div class="font-heading text-slate-400 uppercase tracking-widest text-xs">Tope de indemnización</div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
});
