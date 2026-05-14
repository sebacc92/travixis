import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, z, zod$, type DocumentHead } from '@builder.io/qwik-city';
import { getDb } from '~/db';
import { siteSettings } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { LuImage } from '@qwikest/icons/lucide';
import { put } from '@vercel/blob';
import imageCompression from 'browser-image-compression';

const DEFAULT_SETTINGS = {
  id: 1,
  homeTitle1: 'VIAJAR CON',
  homeTitle2: 'RESPALDO REAL',
  homeSubtitle: 'Tu asistencia, estés donde estés.\nEmergencias, médicos y equipaje — cubierto en todo momento.',
  popupEnabled: false,
  popupImageUrl: null,
  popupTitle: 'Viaja Seguro',
  popupDescription: 'Aprovecha nuestras coberturas integrales sin deducibles.',
  popupCtaText: 'Cotizar Ahora',
  popupCtaLink: 'https://wa.me/5491150532300',
  updatedAt: null,
};

export const useSettingsLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

  if (!settings) {
    // Only returning default if no settings exist, though they usually do
    return DEFAULT_SETTINGS;
  }
  return settings;
});

export const useUpdateWebSettingsAction = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = getDb(requestEvent.env);

      let uploadedPopupUrl = data.popupImageUrl || null;

      // Handle Popup Image Upload
      if (data.popupImage && typeof data.popupImage === 'object' && (data.popupImage as Blob).size > 0) {
        const file = data.popupImage as File;
        const fileName = `popup-${Date.now()}.webp`;
        const { url } = await put(fileName, file, {
          access: 'public',
          token: requestEvent.env.get('BLOB_READ_WRITE_TOKEN'),
        });
        uploadedPopupUrl = url;
      }

      await db
        .update(siteSettings)
        .set({
          // Home Settings
          homeTitle1: data.homeTitle1 || 'VIAJAR CON',
          homeTitle2: data.homeTitle2 || 'RESPALDO REAL',
          homeSubtitle: data.homeSubtitle || '',
          
          // Popup Settings
          popupEnabled: data.popupEnabled === 'on',
          popupTitle: data.popupTitle || null,
          popupDescription: data.popupDescription || null,
          popupCtaText: data.popupCtaText || null,
          popupCtaLink: data.popupCtaLink || null,
          popupImageUrl: uploadedPopupUrl,

          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, 1));

      return { success: true };
    } catch (e: any) {
      console.error('Error updating Web settings:', e);
      return requestEvent.fail(500, { message: e.message || 'Error al guardar el contenido web.' });
    }
  },
  zod$({
    homeTitle1: z.string().optional(),
    homeTitle2: z.string().optional(),
    homeSubtitle: z.string().optional(),

    popupEnabled: z.string().optional(),
    popupTitle: z.string().optional(),
    popupDescription: z.string().optional(),
    popupCtaText: z.string().optional(),
    popupCtaLink: z.string().optional(),
    popupImageUrl: z.string().nullable().optional(),
    popupImage: z.any().optional(),
  }),
);

export default component$(() => {
  const settings = useSettingsLoader();
  const action = useUpdateWebSettingsAction();
  const activeTab = useSignal<'hero' | 'popup'>('hero');
  const isCompressing = useSignal(false);

  const s = settings.value;

  const popupUrl = useSignal(s.popupImageUrl || '');
  const previewPopupUrl = useSignal<string | null>(null);

  const handlePopupChange = $((event: Event) => {
    const element = event.target as HTMLInputElement;
    if (!element.files || element.files.length === 0) return;
    const file = element.files[0];
    previewPopupUrl.value = URL.createObjectURL(file);
    popupUrl.value = '';
  });

  const handleSubmit = $(async (e: Event, currentTarget: HTMLFormElement) => {
    if (isCompressing.value || action.isRunning) return;
    isCompressing.value = true;
    try {
      const formData = new FormData(currentTarget);
      const popupFile = formData.get('popupImage') as File | null;
      if (popupFile && popupFile.size > 0 && popupFile.name) {
        const options = {
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: 'image/webp',
          initialQuality: 0.8,
        };
        const compressedBlob = await imageCompression(popupFile, options);
        formData.set('popupImage', new File([compressedBlob], `popup.webp`, { type: 'image/webp' }));
      }
      await action.submit(formData);
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
    } finally {
      isCompressing.value = false;
    }
  });

  return (
    <div class="max-w-6xl mx-auto space-y-6 pb-20 p-8">
      <div class="space-y-4">
        <div>
          <h1 class="text-3xl font-display text-[#0D1B3E] uppercase tracking-tight">Contenido Web</h1>
          <p class="font-body text-sm text-slate-500 mt-1">
            Administra los textos principales y popups de la Landing Page.
          </p>
        </div>

        <div class="flex gap-1 border-b border-slate-200" role="tablist">
          <button
            type="button"
            class={[
              'px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors',
              activeTab.value === 'hero' ? 'border-[#0D1B3E] text-[#0D1B3E]' : 'border-transparent text-slate-500 hover:text-slate-800',
            ]}
            onClick$={() => activeTab.value = 'hero'}
          >
            Portada (Hero)
          </button>
          <button
            type="button"
            class={[
              'px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors',
              activeTab.value === 'popup' ? 'border-[#C8102E] text-[#C8102E]' : 'border-transparent text-slate-500 hover:text-slate-800',
            ]}
            onClick$={() => activeTab.value = 'popup'}
          >
            Popup Promocional
          </button>
        </div>
      </div>

      <Form action={action} class="space-y-8" preventdefault:submit onSubmit$={handleSubmit}>
        
        {action.value?.success && (
           <div class="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">✅ Contenido guardado correctamente.</div>
        )}
        {action.value?.failed && (
           <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">❌ {action.value.message}</div>
        )}

        {/* HERO TAB */}
        <div class={['animate-in fade-in space-y-6', activeTab.value === 'hero' ? 'block' : 'hidden']}>
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="bg-[#0D1B3E] px-8 py-5">
              <h2 class="text-xl font-display text-white uppercase tracking-wide">Textos Principales</h2>
            </div>

            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Título Principal (Parte 1)</label>
                  <input type="text" name="homeTitle1" value={s.homeTitle1 || ''} placeholder="Ej: VIAJAR CON" class="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-bold" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#C8102E] uppercase mb-1">Título Destacado (Parte 2)</label>
                  <input type="text" name="homeTitle2" value={s.homeTitle2 || ''} placeholder="Ej: RESPALDO REAL" class="w-full rounded-lg border border-red-200 px-4 py-3 text-lg font-bold text-[#C8102E] focus:border-red-400 focus:ring-red-400" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Subtítulo Descriptivo</label>
                <textarea name="homeSubtitle" rows={3} placeholder="Texto que acompaña al título principal..." class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm">{s.homeSubtitle || ''}</textarea>
              </div>
            </div>
          </div>
        </div>

        {/* POPUP TAB */}
        <div class={['animate-in fade-in space-y-6', activeTab.value === 'popup' ? 'block' : 'hidden']}>
           <input type="hidden" name="popupImageUrl" value={popupUrl.value} />
           <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="bg-[#C8102E] px-8 py-5 flex items-center justify-between">
              <h2 class="text-xl font-display text-white uppercase tracking-wide">Popup Promocional</h2>
              <div class="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <input type="checkbox" id="popupEnabled" name="popupEnabled" checked={s.popupEnabled ?? false} class="w-4 h-4" />
                <label for="popupEnabled" class="text-xs font-bold text-white uppercase cursor-pointer">Habilitar Popup</label>
              </div>
            </div>

            <div class="p-8 space-y-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase">Imagen Destacada (Opcional)</label>
                <div class="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden relative">
                  {previewPopupUrl.value || popupUrl.value ? (
                    <img src={previewPopupUrl.value || popupUrl.value} alt="Popup" class="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div class="text-center text-slate-400">
                      <LuImage class="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span class="text-xs uppercase tracking-widest font-bold">Sin imagen</span>
                    </div>
                  )}
                </div>
                <input type="file" name="popupImage" accept="image/*" onChange$={handlePopupChange} class="text-sm mt-2 block" />
              </div>

              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Título Principal</label>
                  <input type="text" name="popupTitle" value={s.popupTitle || ''} class="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-bold" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción corta</label>
                  <textarea name="popupDescription" rows={2} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm">{s.popupDescription || ''}</textarea>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Texto del Botón</label>
                    <input type="text" name="popupCtaText" value={s.popupCtaText || ''} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm" />
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Link del Botón</label>
                    <input type="text" name="popupCtaLink" value={s.popupCtaLink || ''} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            type="submit"
            disabled={action.isRunning || isCompressing.value}
            class="bg-[#0D1B3E] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#1a3a7a] transition disabled:opacity-50"
          >
            {action.isRunning || isCompressing.value ? 'Guardando...' : 'Guardar Todos los Cambios'}
          </button>
        </div>
      </Form>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contenido Web | Travixis',
};
