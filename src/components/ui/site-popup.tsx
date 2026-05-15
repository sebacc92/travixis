import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface SitePopupProps {
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export const SitePopup = component$<SitePopupProps>((props) => {
  const isOpen = useSignal(false);

  useVisibleTask$(() => {
    const hasSeen = sessionStorage.getItem("travixis_popup_seen");
    if (!hasSeen) {
      setTimeout(() => {
        isOpen.value = true;
        sessionStorage.setItem("travixis_popup_seen", "true");
      }, 3000); // Muestra a los 3 segundos
    }
  });

  if (!isOpen.value) return null;

  return (
    <div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button
          onClick$={() => (isOpen.value = false)}
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 text-black rounded-full transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {props.imageUrl && (
          <img src={props.imageUrl} alt="Promoción" class="w-full h-48 object-cover bg-slate-100" />
        )}

        <div class="p-8 text-center">
          {props.title && (
            <h3 class="font-display text-4xl text-brand-navy-dark uppercase leading-none mb-4">
              {props.title}
            </h3>
          )}
          {props.description && (
            <p class="font-body text-slate-500 text-sm leading-relaxed mb-8">
              {props.description}
            </p>
          )}
          {props.ctaText && props.ctaLink && (
            <a
              href={props.ctaLink}
              class="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-brand-red-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {props.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
});
