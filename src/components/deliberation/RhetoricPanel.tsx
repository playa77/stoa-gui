import React from "react";
import { useDeliberationStore } from "../../stores/deliberation";
import { Panel } from "../shared/Panel";
import { Badge } from "../shared/Badge";
import { Hammer, Scale, AlertTriangle, GitCompare } from "lucide-react";

export const RhetoricPanel: React.FC = () => {
  const { result } = useDeliberationStore();

  if (!result || !result.rhetoricAnalysis) return null;

  const analysis = result.rhetoricAnalysis;

  return (
    <div className="h-64 border-t border-zinc-800 bg-zinc-950 p-4 space-y-4 overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-2">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rhetoric & Logic Analysis</h3>
        <div className="flex gap-4 ml-auto">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
            <span className="text-amber-500"><Hammer size={10} /></span> Devices: {analysis.devices.length}
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
            <span className="text-red-500"><AlertTriangle size={10} /></span> Biases: {analysis.biases.length}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar">
        {/* Device Analysis */}
        <div className="min-w-[400px] space-y-2">
          <div className="text-[9px] font-bold text-zinc-600 uppercase mb-2">Rhetorical Devices Identified</div>
          <div className="grid grid-cols-2 gap-2">
            {analysis.devices.map((device, idx) => (
              <div key={idx} className="p-2 bg-zinc-900/40 border border-zinc-800 rounded group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono text-zinc-300 uppercase underline decoration-zinc-700 underline-offset-4">{device.deviceType}</span>
                  <span className="text-[8px] font-mono text-zinc-600">{device.frameId.substring(0, 4)}</span>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 truncate mb-1">"{device.excerpt}"</p>
                <p className="text-[9px] font-mono text-zinc-600 italic leading-snug hidden group-hover:block">{device.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logical Inconsistencies */}
        <div className="min-w-[400px] space-y-2 border-l border-zinc-900 pl-4">
          <div className="text-[9px] font-bold text-zinc-600 uppercase mb-2">Internal Consistency Failure</div>
          <div className="space-y-2 overflow-y-auto">
            {analysis.inconsistencies.map((inc, idx) => (
              <div key={idx} className="p-2 border border-zinc-800/80 bg-red-950/5 rounded">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-zinc-600"><GitCompare size={10} /></span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Frame: {inc.frameId.substring(0, 4)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="text-[9px] font-mono text-zinc-400 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded line-through opacity-50">{inc.claimA}</div>
                  <div className="text-[9px] font-mono text-zinc-300 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded">{inc.claimB}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
