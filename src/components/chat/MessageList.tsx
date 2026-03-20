import { useEffect, useRef } from "react";
import { Message, MessageRole } from "../../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  streaming?: boolean;
  streamBuffer?: string;
}

export const MessageList = ({ messages, streaming, streamBuffer }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamBuffer]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 scroll-smooth"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-50">
            <h3 className="text-sm font-semibold text-text-primary">Empty Session</h3>
            <p className="max-w-xs text-xs text-text-secondary">
              Send a message to start the conversation with OpenClaw.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {streaming && (
          <MessageBubble
            role={MessageRole.ASSISTANT}
            content={streamBuffer || ""}
            isStreaming={true}
          />
        )}
      </div>
    </div>
  );
};
