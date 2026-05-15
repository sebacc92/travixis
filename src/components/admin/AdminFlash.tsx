import { component$ } from "@builder.io/qwik";

export interface AdminFlashProps {
  success?: boolean;
  failed?: boolean;
  message?: string;
  successText?: string;
}

export const AdminFlash = component$<AdminFlashProps>(
  ({ success, failed, message, successText = "Guardado correctamente." }) => {
    if (!success && !failed) return null;

    if (success) {
      return (
        <div class="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
          ✅ {successText}
        </div>
      );
    }

    return (
      <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
        ❌ {message}
      </div>
    );
  },
);
