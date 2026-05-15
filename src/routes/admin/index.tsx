import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, z, zod$, type DocumentHead } from '@builder.io/qwik-city';
import { getDb } from '~/db';
import { siteSettings } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { getSiteSettingsWithDefaults } from '~/server/site-settings';
import { LuImage } from '@qwikest/icons/lucide';
import { uploadImageToBlob } from '~/server/blob-upload';
import { AdminTabs } from '~/components/admin/AdminTabs';
import { AdminFlash } from '~/components/admin/AdminFlash';
import { AdminSectionHeader } from '~/components/admin/AdminSectionHeader';
import { AdminSaveButton } from '~/components/admin/AdminSaveButton';
import {
  compressFormImages,
  useAdminImageUpload,
} from '~/components/admin/use-admin-image-upload';

export const useWebSettingsLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return getSiteSettingsWithDefaults(db);
});

export const useUpdateWebSettingsAction = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = getDb(requestEvent.env);

      let uploadedPopupUrl = data.popupImageUrl || null;

      // Handle Popup Image Upload
      if (data.popupImage && typeof data.popupImage === 'object' && (data.popupImage as Blob).size > 0) {
        const file = data.popupImage as File;
        uploadedPopupUrl = await uploadImageToBlob(
          file,
          `popup-${Date.now()}.webp`,
          requestEvent.env.get('BLOB_READ_WRITE_TOKEN'),
        );
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
  const settings = useWebSettingsLoader();
  const action = useUpdateWebSettingsAction();
  const activeTab = useSignal<'hero' | 'popup'>('hero');
  const s = settings.value;

  const {
    storedUrl: popupUrl,
    previewUrl: previewPopupUrl,
    isCompressing,
    onFileChange: handlePopupChange,
  } = useAdminImageUpload(s.popupImageUrl || '');

  const handleSubmit = $(async (e: Event, currentTarget: HTMLFormElement) => {
    if (isCompressing.value || action.isRunning) return;
    isCompressing.value = true;
    try {
      const formData = new FormData(currentTarget);
      await compressFormImages(formData, [
        { fieldName: 'popupImage', maxWidthOrHeight: 1200, outputFileName: 'popup.webp' },
      ]);
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
          <h1 class="text-3xl font-display text-brand-navy-dark uppercase tracking-tight">Contenido Web</h1>
          <p class="font-body text-sm text-slate-500 mt-1">
            Administra los textos principales y popups de la Landing Page.
          </p>
        </div>

        <AdminTabs
          tabs={[
            { id: 'hero', label: 'Portada (Hero)' },
            { id: 'popup', label: 'Popup Promocional', activeClass: 'border-brand-red text-brand-red' },
          ]}
          activeId={activeTab.value}
          onSelect$={$((id) => {
            activeTab.value = id as 'hero' | 'popup';
          })}
        />
      </div>

      <Form action={action} class="space-y-8" preventdefault:submit onSubmit$={handleSubmit}>
        
        <AdminFlash
          success={action.value?.success}
          failed={action.value?.failed}
          message={action.value?.message}
          successText="Contenido guardado correctamente."
        />

        {/* HERO TAB */}
        <div class={['animate-in fade-in space-y-6', activeTab.value === 'hero' ? 'block' : 'hidden']}>
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <AdminSectionHeader title="Textos Principales" variant="navy" />

            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Título Principal (Parte 1)</label>
                  <input type="text" name="homeTitle1" value={s.homeTitle1 || ''} placeholder="Ej: VIAJAR CON" class="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-bold" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-brand-red uppercase mb-1">Título Destacado (Parte 2)</label>
                  <input type="text" name="homeTitle2" value={s.homeTitle2 || ''} placeholder="Ej: RESPALDO REAL" class="w-full rounded-lg border border-red-200 px-4 py-3 text-lg font-bold text-brand-red focus:border-red-400 focus:ring-red-400" />
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
            <AdminSectionHeader title="Popup Promocional" variant="red">
              <div class="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <input type="checkbox" id="popupEnabled" name="popupEnabled" checked={s.popupEnabled ?? false} class="w-4 h-4" />
                <label for="popupEnabled" class="text-xs font-bold text-white uppercase cursor-pointer">Habilitar Popup</label>
              </div>
            </AdminSectionHeader>

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

        <AdminSaveButton isRunning={action.isRunning} isCompressing={isCompressing.value} />
      </Form>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contenido Web | Travixis',
};
