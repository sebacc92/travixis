import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import logoSrc from "~/media/logo2.svg";
import { CONTACT } from "~/constants/contact";
import { NAV_LINKS } from "~/data/nav";
import { SectionContainer } from "./SectionContainer";
import { PhoneIcon } from "./PhoneIcon";

export const Navbar = component$(() => {
  const menuOpen = useSignal(false);

  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-brand-navy border-b border-white/10">
      <SectionContainer padding="responsive">
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
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} class="text-white/80 hover:text-white text-lg font-medium transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div class="hidden lg:flex items-center gap-3">
            <a
              href={CONTACT.phoneTel}
              id="navbar-emergency-cta"
              class="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-base font-bold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/30"
            >
              <PhoneIcon />
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
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="text-white/80 hover:text-white text-base font-medium"
                onClick$={() => (menuOpen.value = false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={CONTACT.phoneTel}
              class="flex items-center justify-center gap-2 bg-brand-red text-white text-base font-bold px-4 py-3.5 rounded-lg"
            >
              <PhoneIcon class="w-4 h-4" />
              Llamar a Emergencias
            </a>
          </nav>
        )}
      </SectionContainer>
    </header>
  );
});
