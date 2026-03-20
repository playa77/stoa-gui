import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageRole } from "../../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
}

export const MessageBubble = ({ role, content, isStreaming }: MessageBubbleProps) => {
  const isUser = role === MessageRole.USER;

  return (
    <div
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-2 text-sm shadow-sm transition-all",
          isUser
            ? "bg-accent text-white"
            : "bg-bg-elevated border border-border text-text-primary"
        )}
      >
        <div className="flex flex-col space-y-1">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            isUser ? "text-white/70" : "text-text-secondary"
          )}>
            {role}
          </span>
          <div className="whitespace-pre-wrap leading-relaxed">
            {content}
            {isStreaming && (
              <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-accent align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
