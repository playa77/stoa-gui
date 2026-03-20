import { SessionState, SessionMode, MessageRole, PermissionLevel, StreamChunkType } from "./enums";

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  state: SessionState;
  mode: SessionMode;
  parentId: string | null;
  configOverrides: Record<string, unknown>;
  activeSkills: string[];
  activeSkillPack: string | null;
}

export interface Message {
  id: string;
  sessionId: string;
  sequenceNum: number;
  role: MessageRole;
  content: string;
  model: string | null;
  provider: string | null;
  tokenCountIn: number | null;
  tokenCountOut: number | null;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface TraceEvent {
  id: string;
  traceId: string;
  sessionId: string;
  timestamp: string;
  eventType: string;
  data: Record<string, unknown>;
  parentEventId: string | null;
}

export interface ApprovalRequest {
  id: string;
  sessionId: string;
  action: string;
  permissionLevel: PermissionLevel;
  resources: string[];
  reversible: boolean;
  preview: string | null;
  timeoutSeconds: number;
}

export interface ProviderHealth {
  providerId: string;
  available: boolean;
  latencyMs: number;
  error: string | null;
}

export interface Skill {
  skillId: string;
  version: string;
  name: string;
  description: string;
  tags: string[];
}

export interface SkillPackEntry {
  skillId: string;
  required: boolean;
}

export interface SkillPack {
  packId: string;
  version: string;
  name: string;
  description: string;
  skills: SkillPackEntry[];
}

export interface StreamChunk {
  type: StreamChunkType;
  content: string | null;
  data: Record<string, unknown> | null;
}
