import { useEffect, useCallback } from "react";
import { useUIStore } from "../stores/ui";
import { useSessionStore } from "../stores/sessions";
import { SessionMode } from "../types";

export function useKeyboardShortcuts() {
  const { setMode, toggleSidebar, toggleTracePanel, toggleApprovalPanel } = useUIStore();
  const { activeMode, createSession } = useSessionStore.getState();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!event.ctrlKey) return;

    switch (event.key) {
      case "1":
        setMode(SessionMode.CHAT);
        break;
      case "2":
        setMode(SessionMode.RESEARCH);
        break;
      case "3":
        setMode(SessionMode.DELIBERATION);
        break;
      case "4":
        setMode(SessionMode.WORKSPACE);
        break;
      case "5":
        setMode(SessionMode.ARENA);
        break;
      case "6":
        setMode(SessionMode.REPLAY);
        break;
      case "n":
      case "N":
        createSession(activeMode);
        break;
      case "b":
      case "B":
        toggleSidebar();
        break;
      case "t":
      case "T":
        toggleTracePanel();
        break;
      case "A":
        if (event.shiftKey) {
          toggleApprovalPanel();
        }
        break;
    }
  }, [setMode, toggleSidebar, toggleTracePanel, toggleApprovalPanel, activeMode, createSession]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
}
