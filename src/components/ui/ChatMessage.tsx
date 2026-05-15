import { component$ } from "@builder.io/qwik";

export interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export const ChatMessage = component$<ChatMessageProps>(({ role, content }) => {
  const isUser = role === "user";

  return (
    <div class={["flex w-full", isUser ? "justify-end" : "justify-start"]}>
      <div
        class={[
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed",
          isUser
            ? "bg-brand-navy-dark text-white rounded-br-none"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-none",
        ]}
      >
        {content}
      </div>
    </div>
  );
});
