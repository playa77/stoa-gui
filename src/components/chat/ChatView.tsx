import { useEffect, useCallback } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useMessageStore } from "../../stores/messages";
import { useSessionStore } from "../../stores/sessions";

export const ChatView = () => {
  const { activeSessionId } = useSessionStore();
  const { messages, streaming, streamBuffer, fetchHistory, sendMessage } = useMessageStore();

  const sessionMessages = activeSessionId ? messages[activeSessionId] || [] : [];

  useEffect(() => {
    if (activeSessionId) {
      fetchHistory(activeSessionId);
    }
  }, [activeSessionId, fetchHistory]);

  const handleSend = useCallback(async (content: string) => {
    if (activeSessionId) {
      await sendMessage(activeSessionId, content);
    }
  }, [activeSessionId, sendMessage]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-bg-base">
      <MessageList 
        messages={sessionMessages} 
        streaming={streaming} 
        streamBuffer={streamBuffer} 
      />
      <div className="h-[200px]" /> {/* Spacer for input overlay */}
      <ChatInput 
        onSend={handleSend} 
        disabled={streaming || !activeSessionId} 
        activeMode="Chat"
      />
    </div>
  );
};
