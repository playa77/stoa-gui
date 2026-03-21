import React from "react";
import { useTraceStore } from "../../stores/traces";
import { clsx } from "clsx";

export const Timeline: React.FC = () => {
  const { events, activeTraceId, playbackIndex, setPlaybackIndex, selectedEventId, selectEvent } = useTraceStore();
  
  const traceEvents = activeTraceId ? events[activeTraceId] || [] : [];
  
  if (traceEvents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 font-mono text-xs italic">
        NO TRACE SELECTED
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Execution Timeline</h3>
        <div className="text-[9px] text-zinc-500 mt-1 truncate uppercase">{activeTraceId}</div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {traceEvents.map((event, index) => (
          <div
            key={event.id}
            onClick={() => {
              setPlaybackIndex(index);
              selectEvent(event.id);
            }}
            className={clsx(
              "px-3 py-2 border-b border-zinc-900 cursor-pointer transition-colors group",
              playbackIndex === index ? "bg-zinc-800/80" : "hover:bg-zinc-900/50",
              selectedEventId === event.id && "border-l-2 border-l-teal-500"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={clsx(
                "text-[10px] font-mono",
                playbackIndex === index ? "text-teal-400" : "text-zinc-400 group-hover:text-zinc-300"
              )}>
                {event.eventType.split('.').pop()}
              </span>
              <span className="text-[9px] font-mono text-zinc-600 mt-0.5">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            {event.data?.label && (
              <div className="text-[9px] text-zinc-500 mt-1 truncate">
                {String(event.data.label)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
          <span>Events</span>
          <span className="text-zinc-300">{traceEvents.length}</span>
        </div>
      </div>
    </div>
  );
};
