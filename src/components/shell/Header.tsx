import { useSessionStore } from "../../stores/sessions";
import { useConnectionStore } from "../../stores/connection";
import { useApprovalStore } from "../../stores/approvals";
import { useUIStore } from "../../stores/ui";
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
    <header className="flex h-[48px] w-full items-center justify-between border-b border-border bg-bg-surface px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-sm font-semibold tracking-tight text-text-primary">
          {activeSession ? `Session: ${activeSession.id.substring(0, 8)}` : "No Session Selected"}
        </h1>
        {activeSession && (
          <Badge variant="info" className="uppercase tracking-widest text-[10px]">
            {activeSession.mode}
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 border-r border-border pr-6">
          <Badge variant="success" className="h-6 gap-2">
            <Activity size={12} strokeWidth={3} />
            <span>Healthy</span>
          </Badge>
          
          <button 
            onClick={toggleApprovalPanel}
            className="group relative flex items-center"
          >
            <Badge 
              variant={pending.length > 0 ? "warning" : "info"} 
              count={pending.length > 0 ? pending.length : null}
              pulse={pending.length > 0}
              className="h-6"
            >
              {pending.length === 0 && <ShieldAlert size={12} />}
              <span className="ml-1">Approvals</span>
            </Badge>
          </button>
        </div>

        <ConnectionIndicator status={status} />
      </div>
    </header>
  );
};
