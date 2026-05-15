import { component$ } from "@builder.io/qwik";

export type BentoIconBoxVariant = "card" | "coverage";

export interface BentoIconBoxProps {
  iconPath: string;
  variant?: BentoIconBoxVariant;
}

export const BentoIconBox = component$<BentoIconBoxProps>(
  ({ iconPath, variant = "card" }) => {
    if (variant === "coverage") {
      return (
        <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-navy-dark group-hover:bg-brand-red group-hover:scale-110 transition-all duration-500">
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
          </svg>
        </div>
      );
    }

    return (
      <div class="w-14 h-14 bg-brand-navy-dark/5 rounded-2xl flex items-center justify-center mb-6 text-brand-navy-dark group-hover:bg-brand-red group-hover:text-white transition-colors duration-500">
        <svg
          class="w-7 h-7 group-hover:scale-110 transition-transform duration-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
        </svg>
      </div>
    );
  },
);
