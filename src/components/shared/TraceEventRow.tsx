import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TraceEvent } from "../../types";
import { Badge } from "./Badge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TraceEventRowProps {
  event: TraceEvent;
  onClick: (event: TraceEvent) => void;
  className?: string;
}

export const TraceEventRow = ({ event, onClick, className }: TraceEventRowProps) => {
  const timestamp = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      onClick={() => onClick(event)}
      className={cn(
        "flex cursor-pointer items-center space-x-4 border-b border-border/50 py-2 px-4 hover:bg-bg-surface transition-colors",
        className
      )}
    >
      <span className="shrink-0 font-mono text-xs text-text-secondary">
        {timestamp}
      </span>
      <Badge variant="info">
        {event.eventType.toLowerCase()}
      </Badge>
      <span className="truncate text-xs text-text-primary">
        {JSON.stringify(event.data).substring(0, 100)}
      </span>
    </div>
  );
};
