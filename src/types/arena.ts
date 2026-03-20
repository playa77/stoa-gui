export interface EvalRun {
  id: string;
  taskId: string;
  provider: string;
  model: string;
  skillPack: string | null;
  startedAt: string;
  completedAt: string | null;
  status: string;
  scores: Record<string, number>;
  traceId: string | null;
}

export interface RunSummary {
  traceId: string;
  sessionId: string;
  mode: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  eventCount: number;
  providerCalls: number;
  toolCalls: number;
  errors: number;
}

export interface ComparisonResult {
  runIds: string[];
  dimensions: string[];
  scores: Record<string, Record<string, number>>;
}
