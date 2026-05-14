import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import logoSrc from "~/media/logo2.svg";

export const Navbar = component$(() => {
  const menuOpen = useSignal(false);

  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#01254f] border-b border-white/10">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" class="flex items-center gap-3 group">
            <img
              src={logoSrc}
              alt="Travixis Logo"
              width={120}
              height={120}
              class="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Nav */}
          <nav class="hidden lg:flex items-center gap-10" aria-label="Navegación principal">
            <a href="#beneficios" class="text-white/80 hover:text-white text-lg font-medium transition-colors duration-200">Beneficios</a>
            <a href="#cobertura" class="text-white/80 hover:text-white text-lg font-medium transition-colors duration-200">Cobertura</a>
            <a href="#contacto" class="text-white/80 hover:text-white text-lg font-medium transition-colors duration-200">Contacto</a>
          </nav>

          {/* CTA Desktop */}
          <div class="hidden lg:flex items-center gap-3">
            <a
              href="tel:+5491150532300"
              id="navbar-emergency-cta"
              class="flex items-center gap-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-base font-bold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/30"
            >
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" />
              </svg>
              Emergencias
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="navbar-menu-toggle"
            class="lg:hidden flex items-center justify-center w-10 h-10 text-white"
            onClick$={() => (menuOpen.value = !menuOpen.value)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen.value}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen.value ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen.value && (
          <nav class="lg:hidden pb-4 border-t border-white/10 pt-4 flex flex-col gap-5" aria-label="Menú móvil">
            <a href="#beneficios" class="text-white/80 hover:text-white text-base font-medium" onClick$={() => (menuOpen.value = false)}>Beneficios</a>
            <a href="#cobertura" class="text-white/80 hover:text-white text-base font-medium" onClick$={() => (menuOpen.value = false)}>Cobertura</a>
            <a href="#contacto" class="text-white/80 hover:text-white text-base font-medium" onClick$={() => (menuOpen.value = false)}>Contacto</a>
            <a
              href="tel:+5491150532300"
              class="flex items-center justify-center gap-2 bg-[#C8102E] text-white text-base font-bold px-4 py-3.5 rounded-lg"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" />
              </svg>
              Llamar a Emergencias
            </a>
          </nav>
        )}
      </div>
    </header>
  );
});
