import { create } from "zustand";
import { Message, StreamChunk } from "../types";
import { endpoints } from "../api/endpoints";
import { wsManager } from "../api/ws";
import { invoke } from "@tauri-apps/api/core";

interface MessageState {
  messages: Record<string, Message[]>;
  streaming: boolean;
  streamBuffer: string;
  fetchHistory: (sessionId: string) => Promise<void>;
  appendChunk: (sessionId: string, chunk: StreamChunk) => void;
  finalizeStream: (sessionId: string, message: Message) => void;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  streaming: false,
  streamBuffer: "",

  fetchHistory: async (sessionId) => {
    try {
      const response = await endpoints.getMessages(sessionId);
      if (response.status === "ok" && response.data) {
        set((state) => ({
          messages: { ...state.messages, [sessionId]: response.data! },
        }));
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  },

  appendChunk: (_sessionId, chunk) => {
    if (chunk.type === "text" && chunk.content) {
      set((state) => ({
        streamBuffer: state.streamBuffer + chunk.content,
      }));
    }
  },

  finalizeStream: (sessionId, message) => {
    set((state) => {
      const sessionMessages = state.messages[sessionId] || [];
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...sessionMessages, message],
        },
        streaming: false,
        streamBuffer: "",
      };
    });
  },

  sendMessage: async (sessionId, content) => {
    set({ streaming: true, streamBuffer: "" });
    try {
      const token = await invoke<string>("read_api_token");
      wsManager.connect(sessionId, token);

      wsManager.onStream((chunk) => {
        get().appendChunk(sessionId, chunk);
        if (chunk.type === "done") {
          // Final fetch to sync the message
          get().fetchHistory(sessionId);
        }
      });

      wsManager.send(content);
    } catch (e) {
      console.error("Failed to send message:", e);
      set({ streaming: false });
    }
  },
}));
