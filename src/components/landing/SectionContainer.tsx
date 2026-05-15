import { component$, Slot } from "@builder.io/qwik";

export type SectionPadding = "default" | "responsive";

const PADDING_CLASSES: Record<SectionPadding, string> = {
  default: "max-w-[1600px] mx-auto px-6 w-full",
  responsive: "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8",
};

export interface SectionContainerProps {
  padding?: SectionPadding;
  class?: string;
}

export const SectionContainer = component$<SectionContainerProps>(
  ({ padding = "default", class: className }) => {
    const base = PADDING_CLASSES[padding];
    const classes = className ? `${base} ${className}` : base;

    return (
      <div class={classes}>
        <Slot />
      </div>
    );
  },
);
