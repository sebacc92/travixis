import { component$ } from "@builder.io/qwik";

export interface AdminSaveButtonProps {
  isRunning: boolean;
  isCompressing: boolean;
  label?: string;
}

export const AdminSaveButton = component$<AdminSaveButtonProps>(
  ({ isRunning, isCompressing, label = "Guardar Todos los Cambios" }) => {
    const busy = isRunning || isCompressing;

    return (
      <div class="flex justify-end pt-4">
        <button
          type="submit"
          disabled={busy}
          class="bg-brand-navy-dark text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-navy-hover transition disabled:opacity-50"
        >
          {busy ? "Guardando..." : label}
        </button>
      </div>
    );
  },
);
