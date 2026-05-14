import { component$ } from "@builder.io/qwik";

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
      class="relative min-h-screen flex items-center justify-center bg-white pt-32 pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Lado Izquierdo: Texto */}
          <div class="flex flex-col items-start text-left">
            {/* Badge */}
            <div class="inline-flex items-center gap-2 bg-[#0D1B3E]/5 border border-[#0D1B3E]/10 rounded-full px-4 py-2 mb-8">
              <span class="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" aria-hidden="true" />
              <span class="text-[#0D1B3E] font-heading text-sm font-semibold tracking-wide">Asistencia disponible 24/7</span>
            </div>

            {/* Título Principal */}
            <h1
              id="hero-heading"
              class="font-display text-7xl sm:text-8xl lg:text-[100px] text-[#0D1B3E] leading-none uppercase mb-6"
            >
              {title1 || "VIAJAR CON"}<br />
              <span class="text-[#C8102E]">{title2 || "RESPALDO REAL"}</span>
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
                      <span class="font-normal text-[#0D1B3E]/70">{parts.slice(1).join('\n')}</span>
                    </>
                  );
                }
                return content;
              })()}
            </p>

            {/* Call to Action Crítico (Rojo + Glassmorphism) */}
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={`tel:+${whatsappNumber || '5491150532300'}`}
                id="hero-emergency-cta"
                class="group flex items-center gap-4 bg-[#C8102E]/95 backdrop-blur-md hover:bg-[#a50d25] text-white font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-[#C8102E]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#C8102E]/50"
                aria-label="Llamar al número de emergencias"
              >
                <span class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"/>
                  </svg>
                </span>
                <div class="text-left">
                  <div class="text-sm text-white/90 font-normal leading-none mb-1">Llamar a Emergencias</div>
                  <div class="font-display tracking-widest text-3xl leading-none">{whatsappNumber || '5491150532300'}</div>
                </div>
              </a>
            </div>
            
            {/* Indicadores de confianza */}
            <div class="flex flex-wrap items-center gap-8 mt-12">
              {[
                { label: "Respuesta en minutos", icon: "⚡" },
                { label: "Sin copago inicial", icon: "🏥" },
              ].map((item) => (
                <div key={item.label} class="flex items-center gap-2 text-[#0D1B3E]/70">
                  <span class="text-2xl">{item.icon}</span>
                  <span class="font-body text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Lado Derecho: Imagen con contenedor flotante */}
          <div class="relative w-full h-full min-h-[450px] lg:min-h-[650px] rounded-[2rem] shadow-2xl overflow-hidden group">
            {/* Placeholder de alta calidad */}
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1474&auto=format&fit=crop" 
              alt="Avión volando, representando la tranquilidad de viajar asegurado" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay sutil para anclar el diseño premium */}
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 via-transparent to-transparent"></div>
            
            {/* Badge flotante sobre la imagen */}
            <div class="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-transform duration-300 hover:-translate-y-2">
              <div class="flex items-center gap-5">
                 <div class="flex-shrink-0 w-14 h-14 bg-[#0D1B3E] rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                 </div>
                 <div>
                    <p class="font-heading text-lg text-[#0D1B3E] font-bold leading-tight">Cobertura Global</p>
                    <p class="font-body text-sm text-slate-500 mt-1">Protección integral en más de 150 países.</p>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
});
