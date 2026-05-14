import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  const isCollapsed = useSignal(false);

  const navItems = [
    {
      name: "Contenido Web",
      href: "/admin/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      name: "Asistente IA",
      href: "/admin/ia/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
      ),
    },
    {
      name: "Ir al Sitio",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      ),
    }
  ];

  return (
    <div class="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        class={[
          "bg-[#0D1B3E] text-slate-300 flex flex-col shrink-0 shadow-xl z-50 transition-all duration-300 relative print:hidden",
          isCollapsed.value ? "w-20" : "w-64"
        ]}
      >
        {/* Toggle Button */}
        <button
          onClick$={() => isCollapsed.value = !isCollapsed.value}
          class="absolute -right-3 top-6 w-6 h-6 bg-[#0D1B3E] border border-[#1a3a7a] text-slate-300 rounded-full flex items-center justify-center hover:bg-[#1a3a7a] transition-colors z-50 shadow-md"
          title={isCollapsed.value ? "Expandir" : "Colapsar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class={["transition-transform duration-300", isCollapsed.value ? "rotate-180" : ""]}
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div class="h-20 flex items-center px-6 border-b border-white/10 overflow-hidden">
          {isCollapsed.value ? (
            <div class="w-full flex justify-center">
              <div class="flex items-center justify-center w-8 h-8 bg-[#C8102E] rounded-lg shadow-lg shrink-0">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>
          ) : (
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-8 h-8 bg-[#C8102E] rounded-lg shadow-lg shrink-0">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div class="flex flex-col leading-none">
                <span class="text-white font-bold text-base tracking-tight uppercase">Travixis</span>
                <span class="text-[#C8102E] text-[10px] font-medium tracking-widest uppercase">Admin</span>
              </div>
            </div>
          )}
        </div>

        <nav class="flex-1 py-6 px-4 space-y-1 overflow-x-hidden">
          <div class={["text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2 transition-all", isCollapsed.value ? "opacity-0 h-0 mb-0" : "opacity-100"]}>
            {!isCollapsed.value && "Administración"}
          </div>

          {navItems.map((item) => {
            let isActive = false;
            if (item.href === "/admin/") {
              isActive = loc.url.pathname === "/admin" || loc.url.pathname === "/admin/";
            } else if (item.href === "/admin/ia/") {
              isActive = loc.url.pathname.startsWith("/admin/ia");
            } else if (item.href !== "/") {
              isActive = loc.url.pathname.startsWith(item.href);
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed.value ? item.name : ""}
                class={[
                  "flex items-center text-sm font-medium rounded-lg transition-colors overflow-hidden whitespace-nowrap",
                  isCollapsed.value ? "justify-center p-3" : "px-4 py-3",
                  isActive
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5 hover:text-white",
                ]}
              >
                {item.icon}
                <span class={["ml-3 transition-opacity duration-200", isCollapsed.value ? "opacity-0 hidden" : "opacity-100"]}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div class="p-4 border-t border-white/10 overflow-hidden">
          <div class={["flex items-center", isCollapsed.value ? "justify-center" : "gap-3 px-2"]}>
            <div class="w-8 h-8 rounded-full bg-[#C8102E] flex shrink-0 items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            {!isCollapsed.value && (
              <div class="whitespace-nowrap">
                <div class="text-sm font-medium text-white">Admin Travixis</div>
                <div class="text-xs text-slate-400">Panel de Control</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content (Slot) */}
      <div class="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-white">
        <Slot />
      </div>
    </div>
  );
});
