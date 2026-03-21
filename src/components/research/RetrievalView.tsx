import React from "react";
import { useResearchStore } from "../../stores/research";
import { Panel } from "../shared/Panel";
import { Badge } from "../shared/Badge";
import { clsx } from "clsx";
import { Quote } from "lucide-react";

export const RetrievalView: React.FC = () => {
  const { retrievalResults, loading } = useResearchStore();

  if (retrievalResults.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[10px] font-mono text-zinc-700 uppercase italic">
        {loading ? "SEARCHING SOURCES..." : "Awaiting Query Context"}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Retrieval Results</h3>
      {retrievalResults.sort((a, b) => b.score - a.score).map((result, idx) => (
        <Panel key={`${result.sourceId}-${idx}`} className="bg-zinc-900/20 border-zinc-800/80 group">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600"><Quote size={10} /></span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-tight">
                Source: {result.sourceId.substring(0, 8)}
              </span>
            </div>
            <Badge variant="outline" className="text-[9px] bg-zinc-900/50 border-zinc-800">
              Score: {result.score.toFixed(3)}
            </Badge>
          </div>
          
          <div className="text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {result.content}
          </div>
          
          {result.location && (
            <div className="mt-3 text-[9px] font-mono text-zinc-600 italic">
              ↳ At: {result.location}
            </div>
          )}
        </Panel>
      ))}
    </div>
  );
};
