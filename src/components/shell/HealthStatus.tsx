import React from "react";
import { clsx } from "clsx";
import { useConnectionStore } from "../../stores/connection";
import { Activity, ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

interface StatusBadgeProps {
  label: string;
  status: "healthy" | "degraded" | "down";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status }) => (
  <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">
    <div className={clsx(
      "w-1.5 h-1.5 rounded-full",
      status === "healthy" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
      status === "degraded" ? "bg-amber-500" : "bg-red-500"
    )} />
    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tighter">{label}</span>
  </div>
);

export const HealthStatus: React.FC = () => {
  const { providers, status, latencyMs } = useConnectionStore();
  
  const isHealthy = status === "connected" && providers.every(p => p.available);
  const degraded = status === "connected" && providers.some(p => !p.available);

  return (
    <div className="flex items-center gap-4 border-r border-zinc-800 pr-4 mr-4">
      <div className="flex flex-col items-end gap-0.5 mr-2">
        <span className="text-[9px] font-mono text-zinc-600 uppercase leading-none">Latency</span>
        <span className={clsx(
          "text-[10px] font-mono font-bold leading-none",
          latencyMs < 100 ? "text-emerald-500" : latencyMs < 300 ? "text-amber-500" : "text-red-500"
        )}>
          {latencyMs}ms
        </span>
      </div>

      <div className="flex gap-1.5">
        <StatusBadge 
          label="Core" 
          status={status === "connected" ? "healthy" : "down"} 
        />
        <StatusBadge 
          label="IPC" 
          status={status === "connected" ? "healthy" : "down"} 
        />
        <StatusBadge 
          label="Providers" 
          status={isHealthy ? "healthy" : (degraded ? "degraded" : "down")} 
        />
      </div>

      <div className="flex items-center gap-1.5 ml-2 cursor-help group relative">
        <div className={clsx(
          "p-1.5 rounded transition-colors bg-zinc-900 border border-zinc-800",
          isHealthy ? "text-emerald-500" : "text-amber-500"
        )}>
          {isHealthy ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
        </div>
        
        {/* Tooltip for providers */}
        <div className="absolute top-10 right-0 w-48 bg-zinc-950 border border-zinc-800 shadow-2xl p-2 hidden group-hover:block z-50">
          <div className="text-[9px] font-bold text-zinc-500 uppercase mb-2 border-b border-zinc-900 pb-1 flex items-center gap-1">
            <Cpu size={10} /> Provider Health Log
          </div>
          <div className="space-y-1.5">
            {providers.length === 0 ? (
              <div className="text-[9px] font-mono text-zinc-700 italic">No providers active</div>
            ) : (
              providers.map(p => (
                <div key={p.providerId} className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400 truncate w-24 uppercase tracking-tighter">{p.providerId}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600 truncate">{p.latencyMs}ms</span>
                    <div className={clsx("w-1.5 h-1.5 rounded-full", p.available ? "bg-emerald-500" : "bg-red-500")} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
