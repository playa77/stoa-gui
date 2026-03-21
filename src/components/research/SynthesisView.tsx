import React from "react";
import { useResearchStore } from "../../stores/research";
import { Panel } from "../shared/Panel";
import { clsx } from "clsx";
import { Braces, AlertCircle } from "lucide-react";

export const SynthesisView: React.FC = () => {
  const { synthesis, loading } = useResearchStore();

  if (!synthesis) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-l border-zinc-800 bg-zinc-900/10">
        <div className="text-[10px] font-mono text-zinc-700 uppercase italic">
          {loading ? "GENERATING SYNTHESIS..." : "Analysis Engine Idle"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-l border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-teal-500"><Braces size={12} /></span>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Synthesis</h3>
        </div>
        <div className="text-[9px] font-mono text-zinc-500 uppercase">
          Query: {synthesis.query.substring(0, 30)}...
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 space-y-6">
        <div className="space-y-4">
          {synthesis.claims.map((claim, idx) => (
            <div key={idx} className="relative pl-4 border-l-2 border-zinc-800 hover:border-teal-500/50 transition-colors">
              <p className="text-[11px] font-mono text-zinc-300 leading-relaxed mb-2">
                {claim.text}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {claim.citationIds.map(cid => (
                  <span key={cid} className="text-[9px] font-mono bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800 hover:text-teal-400 hover:border-teal-800 cursor-pointer">
                    [{cid.substring(0, 4)}]
                  </span>
                ))}
                {claim.confidence !== null && (
                  <span className={clsx(
                    "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ml-auto",
                    claim.confidence > 0.8 ? "text-teal-500/80 bg-teal-900/20" : "text-amber-500/80 bg-amber-900/20"
                  )}>
                    Confidence: {(claim.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {synthesis.uncertaintyMarkers.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-900">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-600"><AlertCircle size={12} /></span>
              <h4 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Epistemic Uncertainty</h4>
            </div>
            <div className="space-y-2">
              {synthesis.uncertaintyMarkers.map((marker, idx) => (
                <div key={idx} className="text-[10px] font-mono text-zinc-500 italic bg-zinc-900/30 px-3 py-2 rounded">
                  ↳ {marker}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-zinc-900 bg-zinc-900/10">
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600">
          <span>TRACE ID</span>
          <span className="text-zinc-500 lowercase">{synthesis.traceId || "no-trace"}</span>
        </div>
      </div>
    </div>
  );
};
