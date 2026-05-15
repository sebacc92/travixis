import { component$ } from "@builder.io/qwik";
import type { CoverageItem } from "~/data/coverages";
import { BentoIconBox } from "./BentoIconBox";

export interface CoverageCardProps {
  coverage: CoverageItem;
  index: number;
}

export const CoverageCard = component$<CoverageCardProps>(({ coverage, index }) => {
  return (
    <article class="group flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div class="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-2">
        <BentoIconBox iconPath={coverage.icon} variant="coverage" />
        <span class="text-4xl font-black text-slate-100 sm:text-3xl group-hover:text-slate-200 transition-colors duration-300">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-start gap-3 mb-2">
          <h3 class="text-xl font-bold text-brand-navy-dark">{coverage.title}</h3>
          <span class="inline-block bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {coverage.highlight}
          </span>
        </div>
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {coverage.rule}
        </p>
        <p class="text-slate-600 leading-relaxed mb-4">{coverage.detail}</p>

        {coverage.bullets && (
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {coverage.bullets.map((bullet, i) => (
              <li key={i} class="flex items-start gap-2">
                <svg
                  class="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-slate-700 text-sm font-medium">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
});
