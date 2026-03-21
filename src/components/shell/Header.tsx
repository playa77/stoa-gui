import { useSessionStore } from "../../stores/sessions";
import { useConnectionStore } from "../../stores/connection";
import { useApprovalStore } from "../../stores/approvals";
import { useUIStore } from "../../stores/ui";
import { HealthStatus } from "./HealthStatus";
import { ConnectionIndicator } from "../shared/ConnectionIndicator";
import { Badge } from "../shared/Badge";
import { Activity, ShieldAlert } from "lucide-react";

export const Header = () => {
  const { activeSessionId, sessions } = useSessionStore();
  const { status } = useConnectionStore();
  const { pending } = useApprovalStore();
  const { toggleApprovalPanel } = useUIStore();

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  return (
    <header className="flex h-[48px] w-full items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 shadow-sm z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-[11px] font-mono font-bold tracking-tight text-zinc-300 uppercase">
          {activeSession ? `Session: ${activeSession.id.substring(0, 8)}` : "No Session Attached"}
        </h1>
        {activeSession && (
          <Badge variant="info" className="uppercase tracking-[0.15em] text-[9px] bg-zinc-900/50 border-zinc-800/80">
            {activeSession.mode}
          </Badge>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex items-center border-r border-zinc-800 pr-6 mr-6 h-6">
          <HealthStatus />
          
          <button 
            onClick={toggleApprovalPanel}
            className="group relative flex items-center"
          >
            <Badge 
              variant={pending.length > 0 ? "warning" : "info"} 
              count={pending.length > 0 ? pending.length : null}
              pulse={pending.length > 0}
              className="h-6 py-0 px-2 bg-zinc-900 border-zinc-800"
            >
              <ShieldAlert size={12} className={clsx(pending.length > 0 ? "text-amber-500" : "text-zinc-500")} />
              <span className="ml-2 text-[9px] font-mono font-bold uppercase tracking-tighter">Authority</span>
            </Badge>
          </button>
        </div>

        <ConnectionIndicator status={status} />
      </div>
    </header>
  );
};
