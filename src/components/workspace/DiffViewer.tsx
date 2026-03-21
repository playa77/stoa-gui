import React from "react";
import { useWorkspaceStore } from "../../stores/deliberation";
import { Badge } from "../shared/Badge";
import { clsx } from "clsx";
import { FileDiff, Check, X, ShieldAlert } from "lucide-react";

export const DiffViewer: React.FC = () => {
  const { pendingPatch } = useWorkspaceStore();

  if (!pendingPatch) return null;

  return (
    <div className="h-80 border-t border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileDiff size={14} className="text-amber-500" />
          <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Pending Patch Internal Audit</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{pendingPatch.targetPath}</span>
          {pendingPatch.reversible && (
            <Badge variant="outline" className="text-[8px] bg-emerald-950/20 text-emerald-500 border-emerald-900/40 uppercase">Reversible</Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex gap-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] absolute inset-0 pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-10 flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded">
            <div className="text-[9px] font-bold text-zinc-600 uppercase mb-2">Intent Description</div>
            <p className="text-[11px] font-mono text-zinc-400 italic">"{pendingPatch.description}"</p>
          </div>

          <div className="space-y-1">
            {pendingPatch.hunks.map((hunk, idx) => (
              <div key={idx} className="font-mono text-[11px] rounded overflow-hidden border border-zinc-900">
                <div className="bg-zinc-900 px-3 py-1 text-[9px] text-zinc-600 border-b border-zinc-900">
                  @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
                </div>
                <div className="bg-zinc-950 p-2 whitespace-pre leading-snug">
                  {hunk.content.split('\n').map((line, lidx) => (
                    <div 
                      key={lidx} 
                      className={clsx(
                        "px-2 -mx-2",
                        line.startsWith('+') ? "text-emerald-400 bg-emerald-900/10" : 
                        line.startsWith('-') ? "text-red-400 bg-red-900/10" : 
                        "text-zinc-500"
                      )}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 space-y-4 pt-4 border-l border-zinc-900 pl-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-amber-500" />
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase">Operator Authority</h4>
          </div>
          <button className="w-full py-2 bg-emerald-600/10 border border-emerald-500/50 text-emerald-500 font-mono text-[10px] uppercase font-black hover:bg-emerald-600/20 active:bg-emerald-600/30 transition-all flex items-center justify-center gap-2 group">
            <Check size={14} className="group-hover:scale-110 transition-transform" /> Commit Mutation
          </button>
          <button className="w-full py-2 bg-red-600/10 border border-red-500/30 text-red-500 font-mono text-[10px] uppercase font-black hover:bg-red-600/20 active:bg-red-600/30 transition-all flex items-center justify-center gap-2 group">
            <X size={14} className="group-hover:scale-110 transition-transform" /> Reject Patch
          </button>
        </div>
      </div>
    </div>
  );
};
