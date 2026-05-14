import { component$ } from "@builder.io/qwik";

export const AboutSection = component$(() => {
  return (
    <section class="py-24 bg-white relative overflow-hidden" id="nosotros">
      <div class="max-w-[1600px] mx-auto px-6 w-full relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Lado Izquierdo: Composición de Imágenes */}
          <div class="relative h-[600px] hidden lg:block">
            {/* Decoración de fondo */}
            <div class="absolute -left-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-100 to-transparent rounded-full opacity-80 pointer-events-none"></div>
            
            {/* Acento Rojo Lateral */}
            <div class="absolute left-0 top-1/3 w-32 h-32 bg-[#C8102E] rounded-full -translate-x-1/2 animate-pulse"></div>
            
            {/* Imagen Principal Circular */}
            <div class="absolute top-10 left-10 w-[420px] h-[420px] rounded-full overflow-hidden border-8 border-white shadow-2xl z-20">
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop" 
                alt="Turista explorando con un mapa" 
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Imagen Secundaria Circular superpuesta */}
            <div class="absolute bottom-0 right-10 w-[300px] h-[300px] rounded-full overflow-hidden border-8 border-white shadow-xl z-30">
              <img 
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop" 
                alt="Pareja de viajeros felices" 
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Lado Derecho: Texto */}
          <div class="flex flex-col justify-center max-w-2xl mx-auto lg:mx-0 py-10 lg:py-0">
            <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl uppercase mb-10 leading-tight tracking-tight">
              <span class="text-[#C8102E] font-bold">VIAJAR SEGURO</span><br/>
              <span class="text-[#01254f] font-bold">ES PARTE DEL VIAJE</span>
            </h2>
            
            <div class="space-y-6 text-slate-600 font-body text-lg sm:text-xl font-light leading-relaxed mb-12">
              <p>
                Somos una empresa de asistencia al viajero que brinda servicios de protección, cobertura médica y soporte integral durante viajes nacionales, regionales e internacionales.
              </p>
              <p>
                Nuestro objetivo principal es ofrecer tranquilidad y respaldo al viajero, asegurando atención inmediata ante enfermedades, accidentes u otras situaciones imprevistas que puedan ocurrir fuera del domicilio habitual.
              </p>
            </div>
            
            <div class="mb-12 pl-6 sm:pl-8 border-l-4 border-[#C8102E]">
              <p class="font-display text-2xl sm:text-3xl text-[#C8102E] italic font-medium leading-[1.3]">
                Ahora vas a poder viajar por<br/>
                todo el país y los países<br/>
                vecinos sin necesidad de avisar<br/>
                acerca de tu próximo viaje.
              </p>
            </div>
            
            <div class="mt-2">
              <p class="font-body text-xl sm:text-2xl text-[#01254f] font-medium leading-snug">
                En Argentina y países limítrofes<br/>
                <span class="text-[#C8102E]">confiá tu salud a una empresa de salud.</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
