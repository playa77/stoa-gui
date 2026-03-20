import { api } from "./client";
import {
  Session,
  Message,
  Source,
  SourceInput,
  RetrievalResult,
  SynthesisResult,
  DeliberationResult,
  FileInfo,
  FileContent,
  PatchProposal,
  ExecutionResult,
  TraceEvent,
  RunSummary,
  ApprovalRequest,
  EvalRun,
  ComparisonResult,
  Skill,
  SkillPack,
  ProviderHealth,
} from "../types";

export const endpoints = {
  // Sessions
  createSession: (body: {
    mode: string;
    configOverrides?: Record<string, unknown>;
    skills?: string[];
    skillPack?: string;
  }) => api.post<Session>("/sessions", body),

  listSessions: (query?: {
    limit?: number;
    cursor?: string;
    state?: string;
    mode?: string;
  }) => api.get<Session[]>("/sessions", query),

  getSession: (id: string) => api.get<Session>(`/sessions/${id}`),

  updateSession: (id: string, body: Partial<Session>) =>
    api.patch<Session>(`/sessions/${id}`, body),

  branchSession: (id: string, body: { branchPoint: number }) =>
    api.post<Session>(`/sessions/${id}/branch`, body),

  deleteSession: (id: string) => api.delete<null>(`/sessions/${id}`),

  sendMessage: (id: string, body: { content: string; provider?: string; model?: string }) =>
    api.post<Message>(`/sessions/${id}/messages`, body),

  getMessages: (id: string, query?: { limit?: number }) =>
    api.get<Message[]>(`/sessions/${id}/messages`, query),

  // Research
  ingestSources: (body: { sources: SourceInput[] }) =>
    api.post<Source[]>("/research/ingest", body),

  retrieve: (body: {
    query: string;
    sessionId: string;
    strategy?: string;
    topK?: number;
  }) => api.post<RetrievalResult[]>("/research/retrieve", body),

  synthesize: (body: {
    query: string;
    retrievalResults: RetrievalResult[];
    outputFormat?: string;
  }) => api.post<SynthesisResult>("/research/synthesize", body),

  exportResearch: (body: { synthesisId: string; format: string }) =>
    api.post<unknown>("/research/export", body),

  // Deliberation
  runDeliberation: (body: {
    question: string;
    frames: string[];
    rounds?: number;
    rhetoric?: boolean;
    synthesis?: boolean;
  }) => api.post<DeliberationResult>("/deliberation/run", body),

  getDeliberation: (id: string) => api.get<DeliberationResult>(`/deliberation/${id}`),

  getDisagreementSurface: (id: string) =>
    api.get<unknown>(`/deliberation/${id}/surface`),

  // Workspace
  listFiles: (body: { path: string; recursive?: boolean }) =>
    api.post<FileInfo[]>("/workspace/list", body),

  readFile: (body: { path: string }) => api.post<FileContent>("/workspace/read", body),

  writeFile: (body: { path: string; content: string }) =>
    api.post<unknown>("/workspace/write", body),

  proposePatch: (body: { targetPath: string; hunks: unknown[]; description: string }) =>
    api.post<PatchProposal>("/workspace/patch", body),

  applyPatch: (id: string) => api.post<unknown>(`/workspace/patch/${id}/apply`),

  executeCommand: (body: { command: string; workingDir?: string; timeout?: number }) =>
    api.post<ExecutionResult>("/workspace/execute", body),

  // Traces
  getTraceEvents: (traceId: string, query?: { eventTypes?: string[] }) =>
    api.get<TraceEvent[]>(`/traces/${traceId}`, query),

  getTraceSummary: (traceId: string) => api.get<RunSummary>(`/traces/${traceId}/summary`),

  diffTraces: (body: { traceIdA: string; traceIdB: string }) =>
    api.post<unknown>("/traces/diff", body),

  // Approvals
  getPendingApprovals: () => api.get<ApprovalRequest[]>("/approvals/pending"),

  respondToApproval: (id: string, body: { approved: boolean; modifier?: string }) =>
    api.post<null>(`/approvals/${id}`, body),

  // Eval/Arena
  runEval: (body: {
    taskId: string;
    provider: string;
    model: string;
    skillPack?: string;
  }) => api.post<EvalRun>("/eval/run", body),

  listEvalRuns: (query?: { taskId?: string; limit?: number; cursor?: string }) =>
    api.get<EvalRun[]>("/eval/runs", query),

  getEvalRun: (id: string) => api.get<EvalRun>(`/eval/runs/${id}`),

  compareEvalRuns: (body: { runIds: string[]; dimensions?: string[] }) =>
    api.post<ComparisonResult>("/eval/compare", body),

  // Skills
  listSkills: () => api.get<Skill[]>("/skills"),

  getSkill: (id: string) => api.get<Skill>(`/skills/${id}`),

  listSkillPacks: () => api.get<SkillPack[]>("/skills/packs"),

  // Providers
  listProviders: () => api.get<unknown[]>("/providers"),

  getProviderHealth: (id: string) => api.get<ProviderHealth>(`/providers/${id}/health`),
};
