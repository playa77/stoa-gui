import React from "react";
import { useArenaStore } from "../../stores/deliberation";
import { EvalRun } from "../../types";
import { Badge } from "../shared/Badge";
import { clsx } from "clsx";
import { List, Play, Database, Clock } from "lucide-react";

export const RunSidebar: React.FC = () => {
  const { runs, loading, fetchRuns } = useArenaStore();

  React.useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List size={12} className="text-zinc-500" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Run History</h3>
        </div>
        <button 
          onClick={() => fetchRuns()}
          disabled={loading}
          className="hover:text-zinc-300 transition-colors"
        >
          <Clock size={12} className={clsx(loading && "animate-spin text-teal-500")} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {runs.length === 0 ? (
          <div className="text-[10px] font-mono text-zinc-700 p-8 text-center border border-dashed border-zinc-900 uppercase">
            No Evaluation Trace
          </div>
        ) : (
          runs.map((run) => (
            <div 
              key={run.id}
              className="group px-3 py-2 bg-zinc-900/20 border border-zinc-800/50 hover:border-zinc-700 rounded transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-zinc-300 truncate">
                  {run.taskId || run.id.substring(0, 8)}
                </span>
                <Badge variant="outline" className="text-[8px] px-1 py-0 bg-zinc-900 border-zinc-800 text-zinc-500 uppercase">
                  {run.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600">
                <span className="text-zinc-400 uppercase tracking-tighter">{run.model}</span>
                <span className="text-zinc-700">·</span>
                <span className="truncate">{run.provider}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
