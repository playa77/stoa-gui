export enum SessionState {
  CREATED = "created",
  ACTIVE = "active",
  PAUSED = "paused",
  CHECKPOINTED = "checkpointed",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum SessionMode {
  CHAT = "chat",
  RESEARCH = "research",
  DELIBERATION = "deliberation",
  WORKSPACE = "workspace",
  ARENA = "arena",
  REPLAY = "replay",
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
}

export enum ArtifactType {
  REPORT = "report",
  PATCH = "patch",
  FILE = "file",
  EXPORT = "export",
  EVALUATION_RESULT = "evaluation_result",
}

export enum PermissionLevel {
  READ = "read",
  SUGGEST = "suggest",
  WRITE = "write",
  EXECUTE = "execute",
  DELETE = "delete",
  ADMIN = "admin",
}

export enum StreamChunkType {
  TEXT = "text",
  TOOL_CALL = "tool_call",
  TOOL_RESULT = "tool_result",
  CITATION = "citation",
  APPROVAL_REQUIRED = "approval_required",
  ERROR = "error",
  DONE = "done",
}
