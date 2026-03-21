import React from "react";
import { useWorkspaceStore } from "../../stores/deliberation";
import { Panel } from "../shared/Panel";
import { clsx } from "clsx";
import { FileCode, Activity } from "lucide-react";

export const EditorView: React.FC = () => {
  const { openFile } = useWorkspaceStore();

  if (!openFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950/20">
        <div className="text-[10px] font-mono text-zinc-800 uppercase border border-dashed border-zinc-900 p-12 tracking-[0.2em]">
          Selective Inspection Engine Idle
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
      <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <FileCode size={14} className="text-teal-600" />
          <span className="text-[11px] font-mono font-bold text-zinc-300">{openFile.path.split('/').pop()}</span>
          <span className="text-[9px] font-mono text-zinc-600 truncate max-w-[300px]">{openFile.path}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-600 uppercase">Encoding: {openFile.encoding}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent">
        <div className="min-h-full p-6 font-mono text-[12px] leading-relaxed text-zinc-300 whitespace-pre selection:bg-teal-500/30 selection:text-teal-200">
          {openFile.content.split('\n').map((line, idx) => (
            <div key={idx} className="flex group hover:bg-zinc-900/40 -mx-6 px-6">
              <span className="w-12 shrink-0 text-zinc-700 text-[10px] select-none text-right pr-4 border-r border-zinc-900 mr-4 group-hover:text-zinc-500">
                {idx + 1}
              </span>
              <span>{line || " "}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-1 bg-zinc-900 w-full overflow-hidden">
        <div className="h-full bg-teal-600/20 w-1/3 animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
};
