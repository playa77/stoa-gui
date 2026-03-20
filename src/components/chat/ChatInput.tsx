import { useState, useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";
import { Button } from "../shared/Button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  activeMode: string;
}

export const ChatInput = ({ onSend, disabled, activeMode }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-border bg-gradient-to-t from-bg-base/90 p-4 pt-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl max-h-[220px] items-end space-x-2 rounded-lg border border-border bg-bg-surface p-2 shadow-sm focus-within:ring-1 focus-within:ring-accent"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-bg-elevated text-text-secondary">
          <Terminal size={18} />
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Press Ctrl+Enter to send to ${activeMode} mode...`}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent px-2 pb-2 pt-2.5 text-sm text-text-primary focus:outline-hidden disabled:opacity-50"
          rows={1}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          size="sm"
          className="h-10 w-10 shrink-0 p-0 rounded-md"
        >
          <Send size={18} />
        </Button>
      </form>
      <div className="mt-2 text-center text-[10px] text-text-secondary uppercase tracking-widest font-bold">
        Ctrl+Enter to send
      </div>
    </div>
  );
};
