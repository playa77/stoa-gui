import React from "react";
import { useArenaStore } from "../../stores/deliberation";
import { ComparisonResult } from "../../types";
import { Panel } from "../shared/Panel";
import { Badge } from "../shared/Badge";
import { GitCompare, TrendingUp, AlertTriangle } from "lucide-react";

export const ComparisonGrid: React.FC = () => {
  const { comparison, loading } = useArenaStore();

  if (!comparison) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950/20 text-[10px] font-mono text-zinc-800 uppercase italic">
        Select multi-run trace to generate side-by-side evaluation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare size={14} className="text-teal-500" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Model Regression Audit</h3>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 uppercase">
          Comparing {comparison.runIds.length} Execution paths
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="grid grid-cols-2 gap-8 h-full">
           {/* Placeholder for real side-by-side comparison UI mapping */}
           <Panel className="bg-zinc-900/20 flex flex-col items-center justify-center relative group opacity-50">
             <div className="text-[10px] font-mono text-zinc-600 border border-zinc-800 p-8 rounded uppercase tracking-tighter">
               Base Execution (A)
             </div>
           </Panel>

           <Panel className="bg-zinc-900/20 flex flex-col items-center justify-center relative group">
             <div className="text-[10px] font-mono text-teal-600 border border-teal-900/40 p-8 rounded uppercase tracking-tighter">
               Variant Execution (B)
             </div>
             <div className="absolute top-4 right-4 animate-pulse">
               <TrendingUp size={16} className="text-teal-500" />
             </div>
           </Panel>
        </div>
      </div>

      <div className="h-64 border-t border-zinc-800 bg-zinc-900/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={12} className="text-amber-600" />
          <h4 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Observed Variance</h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded">
            <div className="text-[8px] font-bold text-zinc-700 uppercase mb-1">Latency Delta</div>
            <div className="text-[12px] font-mono text-red-500">+420ms (Avg)</div>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded">
            <div className="text-[8px] font-bold text-zinc-700 uppercase mb-1">Token Efficiency</div>
            <div className="text-[12px] font-mono text-emerald-500">-12.4% Usage</div>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded">
            <div className="text-[8px] font-bold text-zinc-700 uppercase mb-1">Tool Chain Success</div>
            <div className="text-[12px] font-mono text-zinc-300">100% Identity</div>
          </div>
        </div>
      </div>
    </div>
  );
};
