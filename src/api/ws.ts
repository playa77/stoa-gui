import { StreamChunk } from "../types";

export type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

type StreamCallback = (chunk: StreamChunk) => void;
type StatusCallback = (status: WebSocketStatus) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private statusListeners: Set<StatusCallback> = new Set();
  private streamListeners: Set<StreamCallback> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private MAX_RECONNECT_ATTEMPTS = 5;
  private INITIAL_BACKOFF_MS = 1000;
  private MAX_BACKOFF_MS = 30000;
  private currentSessionId: string | null = null;
  private currentToken: string | null = null;

  public connect(sessionId: string, token: string) {
    this.currentSessionId = sessionId;
    this.currentToken = token;

    if (this.socket) {
      this.socket.close();
    }

    this.setStatus("connecting");
    const wsUrl = `ws://localhost:8420/api/v1/sessions/${sessionId}/stream?token=${token}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.setStatus("connected");
        this.reconnectAttempts = 0;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const lines = event.data.split("\n").filter((line: string) => line.trim() !== "");
          for (const line of lines) {
            const chunk: StreamChunk = JSON.parse(line);
            this.notifyStream(chunk);

            if (chunk.type === "approval_required") {
              // Dispatch global event for the approval store
              window.dispatchEvent(
                new CustomEvent("approval:required", { detail: chunk.data })
              );
            }

            if (chunk.type === "done") {
              // Handle stream completion
            }
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.socket.onclose = (event) => {
        if (event.code !== 1000) {
          this.setStatus("disconnected");
          this.attemptReconnect();
        } else {
          this.setStatus("disconnected");
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.setStatus("error");
      };
    } catch (error) {
      console.error("WebSocket connection failure:", error);
      this.setStatus("error");
      this.attemptReconnect();
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close(1000, "User disconnected");
      this.socket = null;
    }

    this.currentSessionId = null;
    this.currentToken = null;
    this.setStatus("disconnected");
  }

  public send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content: message }));
    } else {
      console.error("WebSocket is not open");
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error("Max WebSocket reconnection attempts reached");
      return;
    }

    if (!this.currentSessionId || !this.currentToken) return;

    const backoff = Math.min(
      this.INITIAL_BACKOFF_MS * Math.pow(2, this.reconnectAttempts),
      this.MAX_BACKOFF_MS
    );
    const jitter = Math.random() * 500;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      if (this.currentSessionId && this.currentToken) {
        this.connect(this.currentSessionId, this.currentToken);
      }
    }, backoff + jitter);
  }

  private setStatus(status: WebSocketStatus) {
    this.statusListeners.forEach((listener) => listener(status));
  }

  private notifyStream(chunk: StreamChunk) {
    this.streamListeners.forEach((listener) => listener(chunk));
  }

  public onStatus(callback: StatusCallback) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  public onStream(callback: StreamCallback) {
    this.streamListeners.add(callback);
    return () => this.streamListeners.delete(callback);
  }
}

export const wsManager = new WebSocketManager();
export default wsManager;
