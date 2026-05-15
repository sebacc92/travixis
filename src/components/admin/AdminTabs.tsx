import { component$, type QRL } from "@builder.io/qwik";

export interface AdminTabItem {
  id: string;
  label: string;
  /** Tailwind classes when tab is active (border + text) */
  activeClass?: string;
}

export interface AdminTabsProps {
  tabs: AdminTabItem[];
  activeId: string;
  onSelect$: QRL<(id: string) => void>;
}

const DEFAULT_ACTIVE_CLASS = "border-brand-navy-dark text-brand-navy-dark";

export const AdminTabs = component$<AdminTabsProps>(({ tabs, activeId, onSelect$ }) => {
  return (
    <div class="flex gap-1 border-b border-slate-200" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          class={[
            "px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors",
            activeId === tab.id
              ? tab.activeClass ?? DEFAULT_ACTIVE_CLASS
              : "border-transparent text-slate-500 hover:text-slate-800",
          ]}
          onClick$={() => onSelect$(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});
