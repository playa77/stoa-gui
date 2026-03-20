import { Shield, Check, X, AlertCircle } from "lucide-react";
import { ApprovalRequest } from "../../types";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface ApprovalCardProps {
  request: ApprovalRequest;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export const ApprovalCard = ({ request, onApprove, onDeny }: ApprovalCardProps) => {
  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-border bg-bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary capitalize">
              {request.action.replace("_", " ")}
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">
              ID: {request.id.substring(0, 8)}
            </p>
          </div>
        </div>
        <Badge variant={request.permissionLevel === "execute" || request.permissionLevel === "write" ? "error" : "warning"}>
          {request.permissionLevel}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-text-secondary italic">
          <AlertCircle size={12} />
          <span>Requires your approval to proceed</span>
        </div>
        
        {request.resources.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {request.resources.map((res: string) => (
              <span key={res} className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-text-primary">
                {res}
              </span>
            ))}
          </div>
        )}

        {request.preview && (
          <div className="rounded-md bg-bg-base p-2 font-mono text-[10px] text-text-secondary overflow-x-auto whitespace-pre">
            {request.preview}
          </div>
        )}

        {!request.reversible && (
          <div className="flex items-center space-x-1 text-[10px] font-bold text-error uppercase">
            <AlertCircle size={10} />
            <span>Caution: Non-reversible action</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-2">
        <Button
          onClick={() => onApprove(request.id)}
          className="flex-1 bg-success hover:bg-success/90 h-9 text-xs"
        >
          <Check size={14} className="mr-1.5" />
          Approve
        </Button>
        <Button
          onClick={() => onDeny(request.id)}
          variant="secondary"
          className="flex-1 h-9 text-xs border border-border"
        >
          <X size={14} className="mr-1.5" />
          Deny
        </Button>
      </div>
    </div>
  );
};
