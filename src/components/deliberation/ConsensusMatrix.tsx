import React from "react";
import { useDeliberationStore } from "../../stores/deliberation";
import { Panel } from "../shared/Panel";
import { clsx } from "clsx";
import { Target, XCircle, HelpCircle } from "lucide-react";

export const ConsensusMatrix: React.FC = () => {
  const { result } = useDeliberationStore();

  if (!result) return null;

  const { agreements, disagreements, openQuestions } = result.disagreementSurface;

  return (
    <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Disagreement Surface</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Consensus */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600"><Target size={12} /></span>
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Point of Consensus</h4>
          </div>
          {agreements.map((point, idx) => (
            <div key={idx} className="p-2 bg-emerald-950/10 border border-emerald-900/20 rounded">
              <p className="text-[10px] font-mono text-zinc-400 mb-1">{point.text}</p>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all" 
                  style={{ width: `${point.consensusScore * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fundamental Disagreements */}
        <div className="space-y-3 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            <span className="text-red-600"><XCircle size={12} /></span>
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Irreducible Conflict</h4>
          </div>
          {disagreements.map((point, idx) => (
            <div key={idx} className="p-2 bg-red-950/10 border border-red-900/20 rounded">
              <p className="text-[10px] font-mono text-zinc-400 mb-2">{point.text}</p>
              <div className="flex flex-wrap gap-1">
                {point.frameIds.map(fid => (
                  <span key={fid} className="text-[8px] font-mono bg-zinc-800 text-zinc-500 px-1 rounded uppercase tracking-tighter">
                    {fid.substring(0, 4)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Residual Inquiry */}
        <div className="space-y-3 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            <span className="text-amber-600"><HelpCircle size={12} /></span>
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Residual Inquiry</h4>
          </div>
          {openQuestions.map((q, idx) => (
            <div key={idx} className="text-[10px] font-mono text-zinc-500 italic bg-zinc-900/30 px-3 py-2 rounded">
              ↳ {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
