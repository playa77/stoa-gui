import { useTraceStore } from "../../stores/traces";
import { useUIStore } from "../../stores/ui";
import { Panel } from "../shared/Panel";
import { TraceEventRow } from "../shared/TraceEventRow";
import { useSessionStore } from "../../stores/sessions";

export const TracePanel = () => {
  const { tracePanelOpen, toggleTracePanel } = useUIStore();
  const { events, filter } = useTraceStore();
  const { activeSessionId, sessions } = useSessionStore();

  const traceId = activeSessionId ? sessions[activeSessionId]?.id : null;
  const traceEvents = traceId ? events[traceId] || [] : [];
  const filteredEvents = filter.length === 0 
    ? traceEvents 
    : traceEvents.filter(e => filter.includes(e.eventType));

  const handleEventClick = (event: any) => {
    console.log("Trace event detail:", event);
  };

  return (
    <Panel
      position="bottom"
      open={tracePanelOpen}
      onClose={toggleTracePanel}
      title="Trace Timeline"
      className="z-40"
    >
      <div className="flex flex-col space-y-px">
        {filteredEvents.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-text-secondary">
            No trace events for this session.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <TraceEventRow
              key={event.id}
              event={event}
              onClick={handleEventClick}
            />
          ))
        )}
      </div>
    </Panel>
  );
};
