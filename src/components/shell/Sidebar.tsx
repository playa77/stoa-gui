import React from "react";
import { useUIStore } from "../../stores/ui";
import { SessionMode } from "../../types";
import { clsx } from "clsx";
import { 
  MessageSquare, 
  Search, 
  Scale, 
  FolderCode, 
  Trophy, 
  RotateCcw,
  Settings,
  Terminal
} from "lucide-react";

interface NavItemProps {
  mode: SessionMode;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ mode, icon, label }) => {
  const { activeMode, setMode } = useUIStore();
  const isActive = activeMode === mode;

  return (
    <button
      onClick={() => setMode(mode)}
      className={clsx(
        "group relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-200",
        isActive ? "text-teal-500 bg-zinc-900/80" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/40"
      )}
      title={label}
    >
      <div className={clsx(
        "transition-transform duration-200",
        isActive ? "scale-110" : "group-hover:scale-105"
      )}>
        {icon}
      </div>
      <span className={clsx(
        "text-[8px] font-mono mt-1 uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity",
        isActive && "opacity-100"
      )}>
        {label}
      </span>
      {isActive && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-teal-500 rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
      )}
    </button>
  );
};

export const Sidebar = () => {
  return (
    <aside className="flex h-full w-[56px] flex-col items-center bg-zinc-950 border-r border-zinc-900 py-3 shadow-2xl z-50">
      <div className="mb-8 p-2 bg-teal-950/20 rounded-lg border border-teal-900/30">
        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center text-zinc-950 font-black text-xs shadow-[0_0_15px_rgba(20,184,166,0.4)]">
          Σ
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavItem mode={SessionMode.CHAT} icon={<MessageSquare size={18} />} label="CHAT" />
        <NavItem mode={SessionMode.RESEARCH} icon={<Search size={18} />} label="RES" />
        <NavItem mode={SessionMode.DELIBERATION} icon={<Scale size={18} />} label="DELIB" />
        <NavItem mode={SessionMode.WORKSPACE} icon={<FolderCode size={18} />} label="WORK" />
        <NavItem mode={SessionMode.ARENA} icon={<Trophy size={18} />} label="ARENA" />
        <div className="my-2 border-t border-zinc-900 w-8 self-center" />
        <NavItem mode={SessionMode.REPLAY} icon={<RotateCcw size={18} />} label="REPLAY" />
      </nav>

      <div className="mt-auto flex flex-col gap-4 mb-4">
        <button className="text-zinc-700 hover:text-zinc-400 p-2 transition-colors">
          <Terminal size={18} />
        </button>
        <button className="text-zinc-700 hover:text-zinc-400 p-2 transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
};
