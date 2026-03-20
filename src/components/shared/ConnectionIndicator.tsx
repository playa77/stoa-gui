import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConnectionStatus } from "../../stores/connection";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

export const ConnectionIndicator = ({ status }: ConnectionIndicatorProps) => {
  const colors = {
    connected: "bg-success",
    disconnected: "bg-error",
    reconnecting: "bg-warning animate-pulse",
    auth_failed: "bg-error",
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("h-2.5 w-2.5 rounded-full", colors[status])} />
      {status === "auth_failed" && (
        <svg
          className="h-3 w-3 text-error"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      )}
      <span className="text-xs font-medium text-text-secondary capitalize">
        {status.replace("_", " ")}
      </span>
    </div>
  );
};
