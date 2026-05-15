import { component$, Slot } from "@builder.io/qwik";

export type AdminSectionVariant = "navy" | "red";

const VARIANT_CLASSES: Record<AdminSectionVariant, string> = {
  navy: "bg-brand-navy-dark",
  red: "bg-brand-red",
};

export interface AdminSectionHeaderProps {
  title: string;
  variant?: AdminSectionVariant;
}

export const AdminSectionHeader = component$<AdminSectionHeaderProps>(
  ({ title, variant = "navy" }) => {
    return (
      <div
        class={[
          VARIANT_CLASSES[variant],
          "px-8 py-5 flex items-center justify-between",
        ]}
      >
        <h2 class="text-xl font-display text-white uppercase tracking-wide">{title}</h2>
        <Slot />
      </div>
    );
  },
);
