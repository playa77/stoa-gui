import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  MessageSquare, 
  Search, 
  Scale, 
  Terminal, 
  Trophy, 
  History,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { useUIStore } from "../../stores/ui";
import { useSessionStore } from "../../stores/sessions";
import { SessionMode } from "../../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const modes = [
  { id: SessionMode.CHAT, icon: MessageSquare, label: "Chat" },
  { id: SessionMode.RESEARCH, icon: Search, label: "Research" },
  { id: SessionMode.DELIBERATION, icon: Scale, label: "Deliberation" },
  { id: SessionMode.WORKSPACE, icon: Terminal, label: "Workspace" },
  { id: SessionMode.ARENA, icon: Trophy, label: "Arena" },
  { id: SessionMode.REPLAY, icon: History, label: "Replay" },
];

export const Sidebar = () => {
  const { activeMode, setMode, sidebarOpen, toggleSidebar } = useUIStore();
  const { sessions, activeSessionId, setActive, createSession } = useSessionStore();

  const filteredSessions = Object.values(sessions).filter(s => s.mode === activeMode);

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-bg-surface transition-all duration-150 ease-in-out",
        sidebarOpen ? "w-[260px]" : "w-[48px]"
      )}
    >
      {/* Mode Switcher */}
      <div className="flex flex-col items-center space-y-2 border-b border-border p-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            title={mode.label}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
              activeMode === mode.id
                ? "bg-accent text-white"
                : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            )}
          >
            <mode.icon size={20} />
          </button>
        ))}
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {sidebarOpen && (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {activeMode} Sessions
              </h2>
              <button 
                onClick={() => createSession(activeMode)}
                className="rounded-md p-1 hover:bg-bg-elevated text-text-secondary hover:text-text-primary"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActive(session.id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition-colors truncate",
                    activeSessionId === session.id
                      ? "bg-bg-elevated text-text-primary ring-1 ring-inset ring-border"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  )}
                >
                  {session.id.substring(0, 8)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="flex h-12 items-center justify-center border-t border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </div>
  );
};
