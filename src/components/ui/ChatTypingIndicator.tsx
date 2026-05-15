import { component$ } from "@builder.io/qwik";

export const ChatTypingIndicator = component$(() => {
  return (
    <div class="flex justify-start">
      <div class="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" />
        <div class="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div class="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.3s]" />
      </div>
    </div>
  );
});
