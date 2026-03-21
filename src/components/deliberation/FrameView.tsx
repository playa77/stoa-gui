import React from "react";
import { useDeliberationStore } from "../../stores/deliberation";
import { FrameOutput } from "../../types";
import { Panel } from "../shared/Panel";
import { Badge } from "../shared/Badge";
import { clsx } from "clsx";
import { User, MessageSquare, AlertCircle } from "lucide-react";

export const FrameView: React.FC = () => {
  const { result } = useDeliberationStore();

  if (!result || result.frames.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[10px] font-mono text-zinc-700 uppercase italic">
        No deliberation frames active
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-x-auto custom-scrollbar">
      {result.frames.map((frame) => (
        <div key={frame.frameId} className="flex flex-col min-w-[320px] max-w-[400px] h-full">
          <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40 rounded-t border-x border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500"><User size={12} /></span>
              <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest truncate">{frame.label}</h3>
            </div>
            <span className="text-[9px] font-mono text-zinc-600 uppercase italic">Frame: {frame.frameId.substring(0, 4)}</span>
          </div>
          
          <div className="flex-1 bg-zinc-950 border-x border-b border-zinc-800 overflow-y-auto custom-scrollbar p-3 space-y-4">
            <Panel className="bg-zinc-900/10 border-zinc-800/50">
              <p className="text-[11px] font-mono text-zinc-300 leading-relaxed italic">"{frame.position}"</p>
            </Panel>
            
            {frame.critiques.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-zinc-600"><MessageSquare size={10} /></span>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Critiques From Peer Frames</span>
                </div>
                {frame.critiques.map((crit, idx) => (
                  <div key={idx} className="p-2 bg-zinc-900/30 border border-zinc-800/50 rounded group">
                    <div className="flex items-center justify-between mb-1.5 border-b border-zinc-800/50 pb-1">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">From: {crit.frameId.substring(0, 4)}</span>
                      <Badge 
                        variant="outline" 
                        className={clsx(
                          "text-[8px] py-0 px-1 border-0 uppercase font-black",
                          crit.severity === "high" ? "text-red-500" : crit.severity === "medium" ? "text-amber-500" : "text-emerald-500"
                        )}
                      >
                        {crit.severity}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">{crit.critique}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
