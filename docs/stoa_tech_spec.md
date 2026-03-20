# Stoa Technical Specification

**Version:** 1.0.0
**Date:** 2026-03-16
**Companion to:** Stoa Design Document v1.0.0, CAW Technical Specification v1.0.0

---

## 1. Technology Decisions

| Decision | Choice | Rationale | Rejected |
|----------|--------|-----------|----------|
| Shell | Tauri 2 (Rust + WebKitGTK) | Native Linux, small binary, IPC for secure token handling | Electron (bloat), pure web (no disk access) |
| UI framework | React 19 | Ecosystem depth, hooks model, streaming-friendly | Svelte (smaller ecosystem), Solid (less mature tooling) |
| Language | TypeScript 5 strict | Type safety for contract enforcement | Plain JS (no contracts) |
| State | Zustand 5 | Minimal API, TypeScript-native, no boilerplate | Redux (ceremony), Jotai (atomic overkill for this shape) |
| HTTP client | ky | Thin fetch wrapper, retry built-in, TypeScript types | axios (heavier), raw fetch (no retry) |
| Styling | Tailwind CSS 4 | Utility-first, design token mapping, tree-shaking | CSS Modules (less systematic), styled-components (runtime cost) |
| Packaging | AppImage | Single-file distribution, no root required | deb (repo management), Flatpak (sandbox friction with localhost) |
| Target | Ubuntu 24.04 only | Dan's primary machine, WebKitGTK stability | Multi-distro (testing burden) |

---

## 2. Directory Structure

| Directory | Purpose |
|-----------|---------|
| `src-tauri/` | Rust shell: IPC commands, token storage, window config |
| `src/` | React application root |
| `src/api/` | HTTP client, WebSocket manager, endpoint functions |
| `src/stores/` | Zustand stores (one file per domain) |
| `src/components/` | React components organized by mode + shared |
| `src/components/shell/` | Sidebar, Header, TracePanel |
| `src/components/chat/` | Chat mode components |
| `src/components/research/` | Research mode components |
| `src/components/deliberation/` | Deliberation mode components |
| `src/components/workspace/` | Workspace mode components |
| `src/components/arena/` | Arena mode components |
| `src/components/replay/` | Replay mode components |
| `src/components/shared/` | Buttons, badges, modals, inputs, panels |
| `src/hooks/` | Custom React hooks |
| `src/types/` | TypeScript type definitions mirroring CAW API schemas |
| `src/lib/` | Utilities: formatters, keyboard shortcuts, constants |

---

## 3. API Types

Types mirror CAW API schemas (CAW Tech Spec §13.4). The weak coder writes `.ts` files from these tables.

### 3.1 Core Enums

| Enum | Values |
|------|--------|
| `SessionState` | `created`, `active`, `paused`, `checkpointed`, `completed`, `failed` |
| `SessionMode` | `chat`, `research`, `deliberation`, `workspace`, `arena` |
| `MessageRole` | `user`, `assistant`, `system`, `tool` |
| `ArtifactType` | `report`, `patch`, `file`, `export`, `evaluation_result` |
| `PermissionLevel` | `read`, `suggest`, `write`, `execute`, `delete`, `admin` |
| `StreamChunkType` | `text`, `tool_call`, `tool_result`, `citation`, `approval_required`, `error`, `done` |

### 3.2 Core Interfaces

| Interface | Fields |
|-----------|--------|
| `Session` | `id: string`, `createdAt: string`, `updatedAt: string`, `state: SessionState`, `mode: SessionMode`, `parentId: string | null`, `configOverrides: Record<string, unknown>`, `activeSkills: string[]`, `activeSkillPack: string | null` |
| `Message` | `id: string`, `sessionId: string`, `sequenceNum: number`, `role: MessageRole`, `content: string`, `model: string | null`, `provider: string | null`, `tokenCountIn: number | null`, `tokenCountOut: number | null`, `createdAt: string`, `metadata: Record<string, unknown>` |
| `TraceEvent` | `id: string`, `traceId: string`, `sessionId: string`, `timestamp: string`, `eventType: string`, `data: Record<string, unknown>`, `parentEventId: string | null` |
| `ApprovalRequest` | `id: string`, `sessionId: string`, `action: string`, `permissionLevel: PermissionLevel`, `resources: string[]`, `reversible: boolean`, `preview: string | null`, `timeoutSeconds: number` |
| `ProviderHealth` | `providerId: string`, `available: boolean`, `latencyMs: number`, `error: string | null` |
| `Skill` | `skillId: string`, `version: string`, `name: string`, `description: string`, `tags: string[]` |
| `SkillPack` | `packId: string`, `version: string`, `name: string`, `description: string`, `skills: SkillPackEntry[]` |
| `StreamChunk` | `type: StreamChunkType`, `content: string | null`, `data: Record<string, unknown> | null` |

### 3.3 Research Interfaces

| Interface | Fields |
|-----------|--------|
| `Source` | `id: string`, `sessionId: string | null`, `type: string`, `uri: string | null`, `title: string | null`, `contentHash: string | null`, `createdAt: string` |
| `RetrievalResult` | `sourceId: string`, `content: string`, `score: number`, `location: string | null` |
| `SynthesisResult` | `query: string`, `claims: SynthesizedClaim[]`, `uncertaintyMarkers: string[]`, `sourceMap: Record<string, string>`, `rawOutput: string`, `traceId: string` |
| `SynthesizedClaim` | `text: string`, `citationIds: string[]`, `confidence: number | null` |

### 3.4 Deliberation Interfaces

| Interface | Fields |
|-----------|--------|
| `DeliberationResult` | `question: string`, `frames: FrameOutput[]`, `rhetoricAnalysis: RhetoricAnalysis | null`, `disagreementSurface: DisagreementSurface`, `synthesis: string | null`, `traceId: string` |
| `FrameOutput` | `frameId: string`, `label: string`, `position: string`, `critiques: CritiqueResponse[]` |
| `DisagreementSurface` | `agreements: AgreementPoint[]`, `disagreements: DisagreementPoint[]`, `openQuestions: string[]`, `confidenceMap: Record<string, number>` |
| `RhetoricAnalysis` | `devices: RhetoricalDevice[]`, `biases: IdentifiedBias[]`, `inconsistencies: Inconsistency[]`, `crossFrameContradictions: Contradiction[]` |
| `RhetoricalDevice` | `deviceType: string`, `frameId: string`, `excerpt: string`, `explanation: string`, `severity: string` |

### 3.5 Workspace Interfaces

| Interface | Fields |
|-----------|--------|
| `FileInfo` | `path: string`, `name: string`, `isDir: boolean`, `size: number`, `modifiedAt: string` |
| `FileContent` | `path: string`, `content: string`, `encoding: string` |
| `DiffResult` | `pathA: string`, `pathB: string`, `hunks: DiffHunk[]` |
| `PatchProposal` | `id: string`, `targetPath: string`, `hunks: PatchHunk[]`, `description: string`, `reversible: boolean` |
| `ExecutionResult` | `command: string`, `exitCode: number`, `stdout: string`, `stderr: string`, `durationMs: number` |

### 3.6 Arena/Eval Interfaces

| Interface | Fields |
|-----------|--------|
| `EvalRun` | `id: string`, `taskId: string`, `provider: string`, `model: string`, `skillPack: string | null`, `startedAt: string`, `completedAt: string | null`, `status: string`, `scores: Record<string, number>`, `traceId: string | null` |
| `RunSummary` | `traceId: string`, `sessionId: string`, `mode: string`, `startedAt: string`, `completedAt: string | null`, `durationMs: number | null`, `eventCount: number`, `providerCalls: number`, `toolCalls: number`, `errors: number` |
| `ComparisonResult` | `runIds: string[]`, `dimensions: string[]`, `scores: Record<string, Record<string, number>>` |

### 3.7 API Envelope

| Interface | Fields |
|-----------|--------|
| `ApiResponse<T>` | `status: "ok" | "error"`, `data: T | null`, `errorCode: string | null`, `message: string | null`, `pagination: PaginationInfo | null` |
| `PaginationInfo` | `cursor: string | null`, `hasMore: boolean`, `total: number | null` |

---

## 4. Endpoint Functions

Signature table. All functions return `Promise<ApiResponse<T>>` unless noted. Base URL: `http://localhost:8420/api/v1`.

| Function | Method | Path | Params | Return Type |
|----------|--------|------|--------|-------------|
| `createSession` | POST | `/sessions` | `body: { mode, configOverrides?, skills?, skillPack? }` | `ApiResponse<Session>` |
| `listSessions` | GET | `/sessions` | `query: { limit?, cursor?, state?, mode? }` | `ApiResponse<Session[]>` |
| `getSession` | GET | `/sessions/{id}` | `id: string` | `ApiResponse<Session>` |
| `updateSession` | PATCH | `/sessions/{id}` | `id: string, body: Partial<Session>` | `ApiResponse<Session>` |
| `branchSession` | POST | `/sessions/{id}/branch` | `id: string, body: { branchPoint: number }` | `ApiResponse<Session>` |
| `deleteSession` | DELETE | `/sessions/{id}` | `id: string` | `ApiResponse<null>` |
| `sendMessage` | POST | `/sessions/{id}/messages` | `id: string, body: { content, provider?, model? }` | `ApiResponse<Message>` |
| `getMessages` | GET | `/sessions/{id}/messages` | `id: string, query: { limit? }` | `ApiResponse<Message[]>` |
| `ingestSources` | POST | `/research/ingest` | `body: { sources: SourceInput[] }` | `ApiResponse<Source[]>` |
| `retrieve` | POST | `/research/retrieve` | `body: { query, sessionId, strategy?, topK? }` | `ApiResponse<RetrievalResult[]>` |
| `synthesize` | POST | `/research/synthesize` | `body: { query, retrievalResults, outputFormat? }` | `ApiResponse<SynthesisResult>` |
| `exportResearch` | POST | `/research/export` | `body: { synthesisId, format }` | `ApiResponse<Artifact>` |
| `runDeliberation` | POST | `/deliberation/run` | `body: { question, frames, rounds?, rhetoric?, synthesis? }` | `ApiResponse<DeliberationResult>` |
| `getDeliberation` | GET | `/deliberation/{id}` | `id: string` | `ApiResponse<DeliberationResult>` |
| `getDisagreementSurface` | GET | `/deliberation/{id}/surface` | `id: string` | `ApiResponse<DisagreementSurface>` |
| `listFiles` | POST | `/workspace/list` | `body: { path, recursive? }` | `ApiResponse<FileInfo[]>` |
| `readFile` | POST | `/workspace/read` | `body: { path }` | `ApiResponse<FileContent>` |
| `writeFile` | POST | `/workspace/write` | `body: { path, content }` | `ApiResponse<WriteResult>` |
| `proposePatch` | POST | `/workspace/patch` | `body: { targetPath, hunks, description }` | `ApiResponse<PatchProposal>` |
| `applyPatch` | POST | `/workspace/patch/{id}/apply` | `id: string` | `ApiResponse<PatchResult>` |
| `executeCommand` | POST | `/workspace/execute` | `body: { command, workingDir?, timeout? }` | `ApiResponse<ExecutionResult>` |
| `getTraceEvents` | GET | `/traces/{traceId}` | `traceId: string, query: { eventTypes? }` | `ApiResponse<TraceEvent[]>` |
| `getTraceSummary` | GET | `/traces/{traceId}/summary` | `traceId: string` | `ApiResponse<RunSummary>` |
| `diffTraces` | POST | `/traces/diff` | `body: { traceIdA, traceIdB }` | `ApiResponse<RunDiff>` |
| `getPendingApprovals` | GET | `/approvals/pending` | none | `ApiResponse<ApprovalRequest[]>` |
| `respondToApproval` | POST | `/approvals/{id}` | `id: string, body: { approved, modifier? }` | `ApiResponse<null>` |
| `runEval` | POST | `/eval/run` | `body: { taskId, provider, model, skillPack? }` | `ApiResponse<EvalRun>` |
| `listEvalRuns` | GET | `/eval/runs` | `query: { taskId?, limit?, cursor? }` | `ApiResponse<EvalRun[]>` |
| `getEvalRun` | GET | `/eval/runs/{id}` | `id: string` | `ApiResponse<EvalRun>` |
| `compareEvalRuns` | POST | `/eval/compare` | `body: { runIds, dimensions? }` | `ApiResponse<ComparisonResult>` |
| `listSkills` | GET | `/skills` | none | `ApiResponse<Skill[]>` |
| `getSkill` | GET | `/skills/{id}` | `id: string` | `ApiResponse<Skill>` |
| `listSkillPacks` | GET | `/skills/packs` | none | `ApiResponse<SkillPack[]>` |
| `listProviders` | GET | `/providers` | none | `ApiResponse<ProviderConfig[]>` |
| `getProviderHealth` | GET | `/providers/{id}/health` | `id: string` | `ApiResponse<ProviderHealth>` |

---

## 5. HTTP Client

Behavioral spec for `src/api/client.ts`:

- Wraps `ky` with a shared instance configured with `prefixUrl`, `timeout` (30s default), and retry (2 retries, backoff).
- Reads the bearer token from Tauri IPC on initialization; attaches it as `Authorization: Bearer {token}` on every request.
- If a 401 response is received, emits a `connection:auth_failed` event to the connection store and stops retrying.
- Exposes typed wrapper methods: `get<T>`, `post<T>`, `patch<T>`, `del<T>` that parse `ApiResponse<T>` from the JSON body.
- All network errors are caught and normalized to a `{ errorCode, message }` shape before propagating to stores.

---

## 6. WebSocket Manager

Behavioral spec for `src/api/ws.ts`:

- Manages a single WebSocket connection per session at `ws://localhost:8420/api/v1/sessions/{id}/stream?token={token}`.
- Token is read from Tauri IPC; appended as query parameter per CAW Security Roadmap §S-WP03.
- Parses each incoming JSON line into a `StreamChunk` and dispatches to the message store.
- Reconnects on disconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s) plus jitter (0–500ms).
- Exposes `connect(sessionId)`, `disconnect()`, `send(message)`, and a `status` observable (`connecting`, `connected`, `disconnected`, `error`).
- On `approval_required` chunk type, dispatches to the approval store in addition to the message store.
- On `done` chunk type, signals stream completion to the message store.

---

## 7. Zustand Stores

State fields + actions table per store. All stores use Zustand 5 `create()` with TypeScript.

### 7.1 Connection Store

| State Field | Type | Default |
|-------------|------|---------|
| `status` | `"connected" | "disconnected" | "reconnecting" | "auth_failed"` | `"disconnected"` |
| `backendUrl` | `string` | `"http://localhost:8420"` |
| `lastPingAt` | `string | null` | `null` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `connect` | `() => void` | Initiate connection check |
| `disconnect` | `() => void` | Mark disconnected |
| `setStatus` | `(status) => void` | Update status |

### 7.2 Session Store

| State Field | Type | Default |
|-------------|------|---------|
| `sessions` | `Record<string, Session>` | `{}` |
| `activeSessionId` | `string | null` | `null` |
| `loading` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchSessions` | `(mode?: SessionMode) => Promise<void>` | Load sessions from API |
| `createSession` | `(mode, opts?) => Promise<Session>` | Create and set active |
| `setActive` | `(id: string) => void` | Switch active session |
| `updateSession` | `(session: Session) => void` | Upsert session in local state |

### 7.3 Message Store

| State Field | Type | Default |
|-------------|------|---------|
| `messages` | `Record<string, Message[]>` | `{}` — keyed by sessionId |
| `streaming` | `boolean` | `false` |
| `streamBuffer` | `string` | `""` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchHistory` | `(sessionId: string) => Promise<void>` | Load message history |
| `appendChunk` | `(sessionId: string, chunk: StreamChunk) => void` | Append streaming chunk |
| `finalizeStream` | `(sessionId: string, message: Message) => void` | Replace buffer with final message |
| `sendMessage` | `(sessionId: string, content: string) => Promise<void>` | Send via WS, start stream |

### 7.4 Approval Store

| State Field | Type | Default |
|-------------|------|---------|
| `pending` | `ApprovalRequest[]` | `[]` |
| `panelOpen` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchPending` | `() => Promise<void>` | Poll pending approvals |
| `approve` | `(id: string, modifier?: string) => Promise<void>` | Approve a gate |
| `deny` | `(id: string) => Promise<void>` | Deny a gate |
| `togglePanel` | `() => void` | Open/close approval panel |

### 7.5 Trace Store

| State Field | Type | Default |
|-------------|------|---------|
| `events` | `Record<string, TraceEvent[]>` | `{}` — keyed by traceId |
| `panelOpen` | `boolean` | `false` |
| `filter` | `string[]` | `[]` — empty = all types |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchTrace` | `(traceId: string) => Promise<void>` | Load trace events |
| `fetchSummary` | `(traceId: string) => Promise<RunSummary>` | Load run summary |
| `setFilter` | `(types: string[]) => void` | Filter event types |
| `togglePanel` | `() => void` | Toggle trace panel |

### 7.6 Provider Store

| State Field | Type | Default |
|-------------|------|---------|
| `providers` | `ProviderHealth[]` | `[]` |
| `lastChecked` | `string | null` | `null` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchHealth` | `() => Promise<void>` | Poll all provider health |

### 7.7 Skill Store

| State Field | Type | Default |
|-------------|------|---------|
| `skills` | `Skill[]` | `[]` |
| `packs` | `SkillPack[]` | `[]` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchSkills` | `() => Promise<void>` | Load available skills |
| `fetchPacks` | `() => Promise<void>` | Load skill packs |

### 7.8 Research Store

| State Field | Type | Default |
|-------------|------|---------|
| `sources` | `Source[]` | `[]` |
| `retrievalResults` | `RetrievalResult[]` | `[]` |
| `synthesis` | `SynthesisResult | null` | `null` |
| `loading` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `ingest` | `(sources: SourceInput[]) => Promise<void>` | Ingest sources |
| `retrieve` | `(query: string, sessionId: string) => Promise<void>` | Run retrieval |
| `synthesize` | `(query: string) => Promise<void>` | Run synthesis |
| `exportResult` | `(format: string) => Promise<Artifact>` | Export |

### 7.9 Deliberation Store

| State Field | Type | Default |
|-------------|------|---------|
| `result` | `DeliberationResult | null` | `null` |
| `loading` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `run` | `(question, frames, opts?) => Promise<void>` | Start deliberation |
| `fetch` | `(id: string) => Promise<void>` | Load existing result |

### 7.10 Workspace Store

| State Field | Type | Default |
|-------------|------|---------|
| `files` | `FileInfo[]` | `[]` |
| `currentPath` | `string` | `"~"` |
| `openFile` | `FileContent | null` | `null` |
| `pendingPatch` | `PatchProposal | null` | `null` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `navigate` | `(path: string) => Promise<void>` | List directory |
| `openFile` | `(path: string) => Promise<void>` | Read and display file |
| `proposeWrite` | `(path, content) => Promise<void>` | Submit write through approval |
| `executeCommand` | `(cmd: string) => Promise<ExecutionResult>` | Execute with approval |

### 7.11 Arena Store

| State Field | Type | Default |
|-------------|------|---------|
| `runs` | `EvalRun[]` | `[]` |
| `comparison` | `ComparisonResult | null` | `null` |
| `loading` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `startRun` | `(taskId, provider, model, pack?) => Promise<void>` | Start eval |
| `fetchRuns` | `(taskId?: string) => Promise<void>` | List runs |
| `compare` | `(runIds: string[]) => Promise<void>` | Compare runs |

### 7.12 UI Store

| State Field | Type | Default |
|-------------|------|---------|
| `activeMode` | `SessionMode` | `"chat"` |
| `sidebarOpen` | `boolean` | `true` |
| `tracePanelOpen` | `boolean` | `false` |
| `approvalPanelOpen` | `boolean` | `false` |

| Action | Signature | Description |
|--------|-----------|-------------|
| `setMode` | `(mode: SessionMode) => void` | Switch mode |
| `toggleSidebar` | `() => void` | Toggle sidebar |
| `toggleTracePanel` | `() => void` | Toggle trace panel |
| `toggleApprovalPanel` | `() => void` | Toggle approval panel |

---

## 8. Polling

| Target | Interval | Store | Endpoint |
|--------|----------|-------|----------|
| Pending approvals | 2s | Approval | `GET /approvals/pending` |
| Provider health | 10s | Provider | `GET /providers/{id}/health` |
| Active session state | 5s | Session | `GET /sessions/{id}` |

Polling starts on app mount and stops on unmount. Each poller is a `setInterval` managed by a custom hook (`usePolling`) that cleans up on component unmount.

---

## 9. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` through `Ctrl+6` | Switch to mode 1–6 (Chat, Research, Deliberation, Workspace, Arena, Replay) |
| `Ctrl+N` | New session in active mode |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+T` | Toggle trace panel |
| `Ctrl+Shift+A` | Toggle approval panel |

Shortcuts are registered globally via a `useKeyboardShortcuts` hook that delegates to the UI store.

---

## 10. Design Tokens

Single source of truth. CSS custom properties on `:root`.

| Token | Value |
|-------|-------|
| `--color-bg-base` | `#0a0e14` |
| `--color-bg-surface` | `#111720` |
| `--color-bg-elevated` | `#1a2030` |
| `--color-accent` | `#3b9eba` |
| `--color-accent-hover` | `#4fb3d1` |
| `--color-error` | `#e55050` |
| `--color-warning` | `#d4a843` |
| `--color-success` | `#4caf7c` |
| `--color-text-primary` | `#e0e4ea` |
| `--color-text-secondary` | `#8892a0` |
| `--color-border` | `#2a3040` |
| `--font-sans` | `'IBM Plex Sans', sans-serif` |
| `--font-mono` | `'IBM Plex Mono', monospace` |
| `--font-size-xs` | `12px` |
| `--font-size-sm` | `14px` |
| `--font-size-md` | `16px` |
| `--font-size-lg` | `20px` |
| `--font-size-xl` | `24px` |
| `--radius-sm` | `4px` |
| `--radius-md` | `6px` |
| `--radius-lg` | `8px` |
| `--space-unit` | `4px` |

---

## 11. Component Specifications

### 11.1 Shared Components

#### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" | "secondary" | "ghost" | "danger"` | `"primary"` | Visual variant |
| `size` | `"sm" | "md" | "lg"` | `"md"` | Size |
| `loading` | `boolean` | `false` | Show spinner, disable click |
| `disabled` | `boolean` | `false` | Disable interaction |
| `children` | `ReactNode` | — | Button content |
| `onClick` | `() => void` | — | Click handler |

Primary uses `--color-accent` background. Danger uses `--color-error`. Ghost has transparent background with accent text. Loading replaces children with a 16px spinner SVG.

#### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"info" | "warning" | "error" | "success"` | `"info"` | Color variant |
| `count` | `number | null` | `null` | Numeric count; null shows dot only |
| `pulse` | `boolean` | `false` | Animated pulse effect |

Maps to accent/warning/error/success colors. Count > 99 shows "99+".

#### Panel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"bottom" | "right"` | — | Slide direction |
| `open` | `boolean` | — | Controlled open state |
| `onClose` | `() => void` | — | Close handler |
| `title` | `string` | — | Panel header title |
| `children` | `ReactNode` | — | Panel content |

Slides in from specified edge. Background: `--color-bg-elevated`. Border on leading edge: `--color-border`.

#### ConnectionIndicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"connected" | "disconnected" | "reconnecting" | "auth_failed"` | — | Current connection status |

Green dot for connected, red for disconnected, amber pulsing for reconnecting, red with lock icon for auth_failed.

#### TraceEventRow

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `event` | `TraceEvent` | — | Event to display |
| `onClick` | `(event: TraceEvent) => void` | — | Click to expand detail |

One-line display: timestamp (mono, secondary color), event type badge, truncated data summary. Click opens detail panel.

### 11.2 Shell Components

#### Sidebar

Reads `activeMode` and `sidebarOpen` from UI store. Renders mode selector icons (top) and session list (below). Collapsed width: 48px (icons only). Expanded width: 260px. Transition: 150ms ease.

#### Header

Reads from session, connection, provider, and approval stores. Renders: session title (editable inline), ConnectionIndicator, provider health summary badge, approval count Badge (pulse when count > 0). Height: 48px. Background: `--color-bg-surface`.

#### TracePanel

Reads from trace store. Renders filterable list of TraceEventRow components. Height when open: 240px. Collapsible to 0. Transition: 150ms ease.

### 11.3 Mode-Specific Components (behavioral notes only)

**ChatView**: Message list (scrollable, auto-scroll on new message), input bar (textarea, send button, Ctrl+Enter to send), streaming indicator during active stream.

**ResearchView**: Three-column layout — sources panel (left), query/synthesis panel (center), citation detail panel (right). Inline citation highlights link to source excerpts in the right panel.

**DeliberationView**: Frame cards arranged horizontally (2–4 frames). Below: tabbed panel switching between disagreement surface, rhetoric analysis, and synthesis. Frame cards show position text and critique threads.

**WorkspaceView**: Two-panel layout — file browser (left), file viewer/editor (right). Bottom strip: command input with output display. Patch proposals render as inline diffs with approve/deny buttons.

**ArenaView**: Task selector dropdown. Run list table. Side-by-side comparison panel below showing score radar chart and per-dimension bars.

**ReplayView**: Timeline scrubber (horizontal, top). Event list (left). Event detail (right). Run summary card (top-right).

---

## 12. Tauri IPC Commands

Stoa uses Tauri IPC for operations that must not be exposed to the WebKitGTK renderer.

| Command | Direction | Purpose |
|---------|-----------|---------|
| `read_api_token` | Rust → JS | Read bearer token from `~/.config/caw/api_key` |
| `get_token_path` | Rust → JS | Return the expected token file path for setup instructions |

Token is read once at startup and held in a module-scoped variable in `src/api/client.ts`. It is never stored in any browser-accessible storage.

---

## 13. Versioning

All versioned artifacts:

| Artifact | Location | Version Source |
|----------|----------|---------------|
| Stoa app | `package.json` → `version` | SemVer, single source |
| Tauri config | `src-tauri/tauri.conf.json` → `version` | Mirrors `package.json` |
| Rust crate | `src-tauri/Cargo.toml` → `version` | Mirrors `package.json` |
| This spec | Header | Independent SemVer |
| Design doc | Header | Independent SemVer |
| Roadmap | Header | Independent SemVer |
| Impl guide | Header | Independent SemVer |
