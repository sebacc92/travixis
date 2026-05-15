import { component$ } from "@builder.io/qwik";

export type SectionBadgeVariant = "navy" | "red";

export interface SectionBadgeProps {
  label: string;
  variant?: SectionBadgeVariant;
  class?: string;
}

const VARIANT_CLASSES: Record<SectionBadgeVariant, { wrapper: string; label: string }> = {
  navy: {
    wrapper: "bg-brand-navy-dark/5 border border-brand-navy-dark/10",
    label: "text-brand-navy-dark font-heading text-sm font-semibold tracking-wide",
  },
  red: {
    wrapper: "bg-brand-red/10 hover:scale-105 transition-transform duration-300",
    label: "text-brand-red text-sm font-semibold tracking-wide uppercase",
  },
};

export const SectionBadge = component$<SectionBadgeProps>(
  ({ label, variant = "navy", class: className }) => {
    const styles = VARIANT_CLASSES[variant];
    const wrapperClass = className
      ? `inline-flex items-center gap-2 rounded-full px-4 py-2 ${styles.wrapper} ${className}`
      : `inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${styles.wrapper}`;

    return (
      <div class={wrapperClass}>
        <span class="w-2 h-2 rounded-full bg-brand-red animate-pulse" aria-hidden="true" />
        <span class={styles.label}>{label}</span>
      </div>
    );
  },
);
