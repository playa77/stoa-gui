import React from "react";
import { useTraceStore } from "../../stores/traces";
import { Panel } from "../shared/Panel";

export const EventInspector: React.FC = () => {
  const { events, activeTraceId, selectedEventId } = useTraceStore();
  
  const traceEvents = activeTraceId ? events[activeTraceId] || [] : [];
  const event = traceEvents.find(e => e.id === selectedEventId);

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950 p-6">
        <div className="text-zinc-600 font-mono text-xs border border-dashed border-zinc-800 p-8 rounded uppercase tracking-tighter">
          Select an event to inspect payload
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded uppercase">
            {event.eventType}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 truncate">
            {event.id}
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {new Date(event.timestamp).toISOString()}
        </span>
      </div>
      
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <Panel className="bg-zinc-900/30 border-zinc-800">
          <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(event.data, null, 2)}
          </pre>
        </Panel>
        
        {event.parentEventId && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">Parent Context</span>
            <div className="text-[10px] font-mono text-zinc-500 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded">
              {event.parentEventId}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
