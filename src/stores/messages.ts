import { create } from "zustand";
import { Message, StreamChunk } from "../types";
import { MessageRole } from "../types/enums";
import { endpoints } from "../api/endpoints";
import { wsManager } from "../api/ws";
import { invoke } from "@tauri-apps/api/core";

interface MessageState {
  messages: Record<string, Message[]>;
  streaming: boolean;
  streamBuffer: string;
  loading: boolean;
  fetchHistory: (sessionId: string) => Promise<void>;
  appendChunk: (sessionId: string, chunk: StreamChunk) => void;
  finalizeStream: (sessionId: string, message: Message) => void;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  streaming: false,
  streamBuffer: "",
  loading: false,

  fetchHistory: async (sessionId) => {
    set({ loading: true });
    try {
      const response = await endpoints.getMessages(sessionId);
      if (response.status === "ok" && response.data) {
        set((state) => ({
          messages: { ...state.messages, [sessionId]: response.data! },
          loading: false
        }));
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
      set({ loading: false });
    }
  },

  appendChunk: (sessionId, chunk) => {
    if (chunk.type === "text" && chunk.content) {
      set((state) => ({
        streamBuffer: state.streamBuffer + chunk.content,
      }));
    }
    
    if (chunk.type === "done") {
        get().fetchHistory(sessionId);
    }
  },

  finalizeStream: (sessionId, message) => {
    set((state) => {
      const sessionMessages = state.messages[sessionId] || [];
      if (sessionMessages.find(m => m.id === message.id)) {
        return { streaming: false, streamBuffer: "" };
      }
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...sessionMessages, message],
        },
        streaming: false,
        streamBuffer: ""
      };
    });
  },

  sendMessage: async (sessionId, content) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sessionId,
      sequenceNum: (get().messages[sessionId]?.length || 0) + 1,
      role: MessageRole.USER,
      content,
      model: null,
      provider: null,
      tokenCountIn: null,
      tokenCountOut: null,
      createdAt: new Date().toISOString(),
      metadata: {}
    } as Message;

    set((state) => ({
      streaming: true,
      streamBuffer: "",
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), userMsg]
      }
    }));

    try {
      const token = await invoke<string>("read_api_token");
      
      const unbind = wsManager.onStream((chunk) => {
         if (chunk.type === "done") {
             unbind();
         }
         get().appendChunk(sessionId, chunk);
      });

      wsManager.connect(sessionId, token);
      wsManager.send(content);
    } catch (e) {
      console.error("Failed to send message:", e);
      set({ streaming: false });
    }
  },
}));
