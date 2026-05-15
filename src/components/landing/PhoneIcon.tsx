import { component$ } from "@builder.io/qwik";

export const PHONE_ICON_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z";

export interface PhoneIconProps {
  class?: string;
}

export const PhoneIcon = component$<PhoneIconProps>(({ class: className = "w-5 h-5 shrink-0" }) => {
  return (
    <svg class={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={PHONE_ICON_PATH} />
    </svg>
  );
});
