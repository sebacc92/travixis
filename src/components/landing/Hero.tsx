import { component$ } from "@builder.io/qwik";

export const Hero = component$(() => {
  return (
    <section
      id="inicio"
      class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D1B3E]"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient background */}
      <div class="absolute inset-0" aria-hidden="true">
        {/* Deep navy base */}
        <div class="absolute inset-0 bg-gradient-to-br from-[#0D1B3E] via-[#112255] to-[#0a1428]" />

        {/* Globe-like radial accent */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#1a3a7a]/20 blur-3xl" />
        <div class="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C8102E]/10 blur-3xl" />

        {/* Subtle grid overlay */}
        <div
          class="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated floating dots */}
        <div class="absolute top-1/5 left-1/4 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDuration: "3s" }} />
        <div class="absolute top-2/3 left-1/5 w-1 h-1 rounded-full bg-[#C8102E]/60 animate-pulse" style={{ animationDuration: "4s" }} />
        <div class="absolute top-1/3 right-1/5 w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDuration: "2.5s" }} />
        <div class="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#C8102E]/40 animate-pulse" style={{ animationDuration: "5s" }} />
      </div>

      {/* Content */}
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">

        {/* Badge */}
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span class="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" aria-hidden="true" />
          <span class="text-white/90 text-sm font-medium tracking-wide">Asistencia disponible 24/7</span>
        </div>

        {/* Main heading */}
        <h1
          id="hero-heading"
          class="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6"
        >
          VIAJAR CON
          <br />
          <span class="relative inline-block">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#C8102E] via-[#e8334a] to-[#C8102E]">
              RESPALDO
            </span>
          </span>
          <br />
          REAL
        </h1>

        {/* Subtitle */}
        <p class="text-xl sm:text-2xl text-white/70 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Tu asistencia, estés donde estés.
          <br />
          <span class="text-white/50 text-lg">Emergencias, médicos, equipaje — cubierto.</span>
        </p>

        {/* CTA Buttons */}
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">

          {/* Primary CTA – Emergency phone */}
          <a
            href="tel:+5491150532300"
            id="hero-emergency-cta"
            class="group flex items-center gap-3 bg-[#C8102E] hover:bg-[#a50d25] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-red-900/40 transition-all duration-300 hover:scale-105 hover:shadow-red-900/60 w-full sm:w-auto justify-center"
            aria-label="Llamar al número de emergencias"
          >
            <span class="flex items-center justify-center w-9 h-9 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"/>
              </svg>
            </span>
            <div class="text-left">
              <div class="text-xs text-white/80 font-normal leading-none mb-0.5">Emergencias</div>
              <div>54 9 11 5053-2300</div>
            </div>
          </a>

          {/* Secondary CTA */}
          <a
            href="#cobertura"
            id="hero-coverage-cta"
            class="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center backdrop-blur-sm"
          >
            Ver coberturas
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Trust indicators */}
        <div class="flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { label: "Respuesta inmediata", icon: "⚡" },
            { label: "Cobertura global", icon: "🌍" },
            { label: "Sin franquicia médica", icon: "🏥" },
          ].map((item) => (
            <div key={item.label} class="flex items-center gap-2 text-white/60">
              <span class="text-lg">{item.icon}</span>
              <span class="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
        <span class="text-xs tracking-widest uppercase">Scroll</span>
        <div class="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
});
