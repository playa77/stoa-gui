import { useEffect, useRef } from "react";
import { useApprovalStore } from "../stores/approvals";
import { useProviderStore } from "../stores/providers";
import { useSessionStore } from "../stores/sessions";

export function usePolling() {
  const { fetchPending } = useApprovalStore();
  const { fetchHealth } = useProviderStore();
  const { activeSessionId, sessions, updateSession } = useSessionStore();

  const approvalTimer = useRef<NodeJS.Timeout | null>(null);
  const healthTimer = useRef<NodeJS.Timeout | null>(null);
  const sessionTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Pending Approvals - 2s
    approvalTimer.current = setInterval(() => {
      fetchPending();
    }, 2000);

    // 2. Provider Health - 10s
    healthTimer.current = setInterval(() => {
      fetchHealth();
    }, 10000);

    // Cleanup
    return () => {
      if (approvalTimer.current) clearInterval(approvalTimer.current);
      if (healthTimer.current) clearInterval(healthTimer.current);
    };
  }, [fetchPending, fetchHealth]);

  useEffect(() => {
    // 3. Active Session Status - 5s
    if (sessionTimer.current) clearInterval(sessionTimer.current);

    if (activeSessionId) {
      sessionTimer.current = setInterval(async () => {
        // Here we would fetch and update session state
        // await endpoints.getSession(activeSessionId)
      }, 5000);
    }

    return () => {
      if (sessionTimer.current) clearInterval(sessionTimer.current);
    };
  }, [activeSessionId, sessions, updateSession]);
}
