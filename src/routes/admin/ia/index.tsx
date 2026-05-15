import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, z, zod$, type DocumentHead } from '@builder.io/qwik-city';
import { siteSettings, chatSessions, chatMessages } from '~/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { CONTACT } from '~/constants/contact';
import { getOrCreateSiteSettings } from '~/server/site-settings';
import { LuImage, LuTrash2 } from '@qwikest/icons/lucide';
import { getDb } from '~/db';
import { uploadImageToBlob } from '~/server/blob-upload';
import { AdminTabs } from '~/components/admin/AdminTabs';
import { AdminFlash } from '~/components/admin/AdminFlash';
import { AdminSectionHeader } from '~/components/admin/AdminSectionHeader';
import { AdminSaveButton } from '~/components/admin/AdminSaveButton';
import {
  compressFormImages,
  useAdminImageUpload,
} from '~/components/admin/use-admin-image-upload';

export const useChatSessions = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);

  const sessions = await db
    .select({
      id: chatSessions.id,
      createdAt: chatSessions.createdAt,
      lastActive: chatSessions.lastActive,
      messageCount: count(chatMessages.id),
    })
    .from(chatSessions)
    .leftJoin(chatMessages, eq(chatSessions.id, chatMessages.sessionId))
    .groupBy(chatSessions.id)
    .orderBy(desc(chatSessions.lastActive));

  return sessions;
});

export const useDeleteChatAction = routeAction$(async (data, requestEvent) => {
  const id = data.id as string;
  if (!id) return requestEvent.fail(400, { message: 'ID no proporcionado.' });

  try {
    const db = getDb(requestEvent.env);
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, id));
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
    return { success: true };
  } catch (err) {
    console.error('Error deleting chat session:', err);
    return requestEvent.fail(500, { message: 'Error interno al eliminar el chat.' });
  }
});

export const useAiSettingsLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return getOrCreateSiteSettings(db);
});

export const useUpdateAiSettingsAction = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = getDb(requestEvent.env);

      let uploadedAvatarUrl = data.aiAvatarUrl || null;

      // Handle Avatar Image
      if (data.image && typeof data.image === 'object' && (data.image as Blob).size > 0) {
        const file = data.image as File;
        uploadedAvatarUrl = await uploadImageToBlob(
          file,
          `ai-avatar-${Date.now()}.webp`,
          requestEvent.env.get('BLOB_READ_WRITE_TOKEN'),
        );
      }

      await db
        .update(siteSettings)
        .set({
          aiEnabled: data.aiEnabled === 'on',
          aiTone: data.aiTone || null,
          aiInstructions: data.aiInstructions || null,
          aiKnowledge: data.aiKnowledge || null,
          aiInitialGreeting: data.aiInitialGreeting || null,
          aiCallToAction: data.aiCallToAction || null,
          whatsappNumber: data.whatsappNumber || CONTACT.phoneE164,
          aiAvatarUrl: uploadedAvatarUrl,

          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, 1));

      return { success: true };
    } catch (e: any) {
      console.error('Error updating AI settings:', e);
      return requestEvent.fail(500, { message: e.message || 'Error al guardar los ajustes de IA.' });
    }
  },
  zod$({
    aiEnabled: z.string().optional(),
    aiTone: z.string().optional(),
    aiInstructions: z.string().optional(),
    aiKnowledge: z.string().optional(),
    aiInitialGreeting: z.string().optional(),
    aiCallToAction: z.string().optional(),
    whatsappNumber: z.string().optional(),
    aiAvatarUrl: z.string().nullable().optional(),
    image: z.any().optional(),
  }),
);

export default component$(() => {
  const sessionsLoader = useChatSessions();
  const deleteAction = useDeleteChatAction();
  const settings = useAiSettingsLoader();
  const action = useUpdateAiSettingsAction();

  const activeTab = useSignal<'audit' | 'config'>('audit');

  const s = settings.value;

  const {
    storedUrl: avatarUrl,
    previewUrl: previewAvatarUrl,
    isCompressing,
    onFileChange: handleAvatarChange,
  } = useAdminImageUpload(s.aiAvatarUrl || '');

  const handleSubmit = $(async (e: Event, currentTarget: HTMLFormElement) => {
    if (isCompressing.value || action.isRunning) return;

    isCompressing.value = true;
    try {
      const formData = new FormData(currentTarget);
      await compressFormImages(formData, [
        { fieldName: 'image', maxWidthOrHeight: 500, outputFileName: 'avatar.webp' },
      ]);
      await action.submit(formData);
    } catch (error) {
      console.error('Error al comprimir/subir imágenes:', error);
    } finally {
      isCompressing.value = false;
    }
  });

  return (
    <div class="max-w-6xl mx-auto space-y-6 pb-20 p-8">
      <div class="space-y-4">
        <div>
          <h1 class="text-3xl font-display text-brand-navy-dark uppercase tracking-tight">Travixis Settings</h1>
          <p class="font-body text-sm text-slate-500 mt-1">
            Administra el comportamiento del Chatbot y el Popup Promocional.
          </p>
        </div>

        <AdminTabs
          tabs={[
            { id: 'audit', label: 'Auditoría Chats' },
            { id: 'config', label: 'Chatbot IA' },
          ]}
          activeId={activeTab.value}
          onSelect$={$((id) => {
            activeTab.value = id as 'audit' | 'config';
          })}
        />
      </div>

      {activeTab.value === 'audit' && (
        <div class="space-y-6 animate-in fade-in">
          <AdminFlash success={deleteAction.value?.success} successText="Chat eliminado." />

          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inicio</th>
                    <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actividad</th>
                    <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mensajes</th>
                    <th scope="col" class="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                  {sessionsLoader.value.map((session) => (
                    <tr key={session.id} class="hover:bg-slate-50">
                      <td class="px-6 py-4 text-sm font-semibold text-slate-700">
                        {session.createdAt ? new Date(session.createdAt).toLocaleString('es-AR') : '—'}
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-500">
                        {session.lastActive ? new Date(session.lastActive).toLocaleString('es-AR') : '—'}
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-navy-dark/10 text-brand-navy-dark">
                          {session.messageCount}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <Form action={deleteAction} class="inline-block">
                          <input type="hidden" name="id" value={session.id} />
                          <button
                            type="submit"
                            class="text-red-500 hover:text-red-700 p-2"
                            preventdefault:click
                            onClick$={(e, el) => {
                              if (confirm('¿Eliminar chat permanentemente?')) {
                                (el.closest('form') as HTMLFormElement).requestSubmit();
                              }
                            }}
                          >
                            <LuTrash2 class="w-5 h-5" />
                          </button>
                        </Form>
                      </td>
                    </tr>
                  ))}
                  {sessionsLoader.value.length === 0 && (
                    <tr>
                      <td colSpan={4} class="px-6 py-10 text-center text-slate-400">No hay chats registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Unified Form for both Config and Popup tabs */}
      <Form action={action} class={{ 'hidden': activeTab.value === 'audit', 'space-y-8': true }} preventdefault:submit onSubmit$={handleSubmit}>

        <AdminFlash
          success={action.value?.success}
          failed={action.value?.failed}
          message={action.value?.message}
          successText="Configuración guardada."
        />

        <div class={['animate-in fade-in space-y-6', activeTab.value === 'config' ? 'block' : 'hidden']}>
          <input type="hidden" name="aiAvatarUrl" value={avatarUrl.value} />

          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <AdminSectionHeader title="Comportamiento IA" variant="navy">
              <div class="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <input type="checkbox" id="aiEnabled" name="aiEnabled" checked={s.aiEnabled ?? true} class="w-4 h-4" />
                <label for="aiEnabled" class="text-xs font-bold text-white uppercase cursor-pointer">Habilitado</label>
              </div>
            </AdminSectionHeader>

            <div class="p-8 space-y-6">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="shrink-0 space-y-2 flex flex-col items-center">
                  <label class="text-xs font-bold text-slate-500 uppercase">Avatar</label>
                  <div class="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center overflow-hidden relative">
                    {previewAvatarUrl.value || avatarUrl.value ? (
                      <img src={previewAvatarUrl.value || avatarUrl.value} alt="Avatar IA" class="w-full h-full object-cover" />
                    ) : (
                      <LuImage class="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <input type="file" name="image" accept="image/*" onChange$={handleAvatarChange} class="text-xs w-full max-w-[120px]" />
                </div>

                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tono y Personalidad</label>
                    <input type="text" name="aiTone" value={s.aiTone || ''} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp de Contacto</label>
                    <input type="text" name="whatsappNumber" value={s.whatsappNumber || ''} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Instrucciones Estrictas</label>
                <textarea name="aiInstructions" rows={3} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm">{s.aiInstructions || ''}</textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Conocimiento / Reglas</label>
                <textarea name="aiKnowledge" rows={4} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm">{s.aiKnowledge || ''}</textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Saludo Inicial</label>
                <textarea name="aiInitialGreeting" rows={2} class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm">{s.aiInitialGreeting || ''}</textarea>
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
  title: 'Admin IA y Popups | Travixis',
};
