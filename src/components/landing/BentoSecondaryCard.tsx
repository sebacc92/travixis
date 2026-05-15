import { component$, Slot } from "@builder.io/qwik";
import { BentoIconBox } from "./BentoIconBox";

export interface BentoSecondaryCardProps {
  iconPath: string;
  title: string;
  description: string;
}

export const BentoSecondaryCard = component$<BentoSecondaryCardProps>(
  ({ iconPath, title, description }) => {
    return (
      <div class="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
        <div>
          <BentoIconBox iconPath={iconPath} variant="card" />
          <h3 class="font-heading text-2xl text-brand-navy-dark font-bold mb-3 group-hover:text-brand-red transition-colors duration-300">
            {title}
          </h3>
          <p class="font-body text-slate-600 font-light text-base leading-relaxed mb-8">
            {description}
          </p>
        </div>
        <Slot />
      </div>
    );
  },
);
