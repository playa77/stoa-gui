import { ShieldCheck, Info } from "lucide-react";
import { useApprovalStore } from "../../stores/approvals";
import { useUIStore } from "../../stores/ui";
import { Panel } from "../shared/Panel";
import { ApprovalCard } from "../shared/ApprovalCard";

export const ApprovalPanel = () => {
  const { pending, approve, deny } = useApprovalStore();
  const { approvalPanelOpen, toggleApprovalPanel } = useUIStore();

  return (
    <Panel
      position="right"
      open={approvalPanelOpen}
      onClose={toggleApprovalPanel}
      title="Approval Gate"
      className="z-50 border-l border-border bg-bg-surface shadow-2xl"
    >
      <div className="flex flex-col h-full space-y-4">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-text-primary">All Clear</h3>
              <p className="text-xs text-text-secondary">
                No pending approval requests. OpenClaw is operating within established limits.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 rounded-md bg-info/10 p-3 text-xs text-info ring-1 ring-inset ring-info/20">
              <Info size={14} className="shrink-0" />
              <span>Review requested actions for the active session.</span>
            </div>
            <div className="flex flex-col space-y-4">
              {pending.map((request) => (
                <ApprovalCard
                  key={request.id}
                  request={request}
                  onApprove={approve}
                  onDeny={deny}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
};
