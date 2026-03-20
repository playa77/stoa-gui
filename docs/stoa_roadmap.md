# Stoa Atomic Roadmap

**Version:** 1.0.0
**Date:** 2026-03-16
**Companion to:** Stoa Design Document v1.0.0, Stoa Technical Specification v1.0.0, Stoa Implementation Guide v1.0.0

---

## 0. How to Read This Document

Each work package references the Tech Spec by section number for all contracts. The implementation agent must consult the Tech Spec for type definitions, store shapes, and component props — they are not repeated here.

WP format: ID, complexity (S < 100 LOC, M 100–400, L 400+), dependencies, objective, files, spec, acceptance criteria. Tests follow Impl Guide §3.

---

## Milestone 0: Project Bootstrap

**Goal:** `pnpm install` succeeds, `pnpm check` passes, Tauri dev build compiles.

### M0-WP01: Repository and Tauri scaffold
**Complexity:** M | **Deps:** none

**Objective:** Initialize Tauri 2 + React 19 + TypeScript 5 project with all tooling configured.

**Files:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `vite.config.ts`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/src/main.rs`, `src-tauri/src/lib.rs`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore`, `CHANGELOG.md`, `README.md`

**Spec:** Initialize with `pnpm create tauri-app` targeting React+TS. Set app version to `0.1.0` in all three locations per Tech Spec §13. Configure Tailwind CSS 4 with design tokens from Tech Spec §10 as CSS custom properties in `src/index.css`. Import IBM Plex Sans and IBM Plex Mono via `@fontsource`. Set TypeScript to strict mode. App.tsx renders a placeholder dark-themed div confirming the shell loads.

**Acceptance criteria:**
1. `pnpm install` completes without error.
2. `pnpm dev` launches a Tauri window with the placeholder content.
3. `pnpm check` (tsc --noEmit) passes.
4. All design tokens from Tech Spec §10 present in index.css.
5. `package.json` version is `0.1.0`.
6. CHANGELOG.md initialized per Keep a Changelog format.

### M0-WP02: Directory structure
**Complexity:** S | **Deps:** M0-WP01

**Objective:** Create all directories from Tech Spec §2 with index barrel files.

**Files:** All directories listed in Tech Spec §2, each with an `index.ts` barrel file.

**Spec:** Create every directory. Each `index.ts` is initially empty (will re-export as modules are built). No components or logic — structure only.

**Acceptance criteria:**
1. All directories from Tech Spec §2 exist.
2. `pnpm check` passes.
3. No circular imports.

---

## Milestone 1: API Layer

**Goal:** HTTP client and WebSocket manager are operational. All endpoint functions are typed and callable.

### M1-WP01: TypeScript type definitions
**Complexity:** M | **Deps:** M0-WP02

**Objective:** Define all API types from Tech Spec §3 as TypeScript interfaces and enums.

**Files:** `src/types/enums.ts`, `src/types/core.ts`, `src/types/research.ts`, `src/types/deliberation.ts`, `src/types/workspace.ts`, `src/types/arena.ts`, `src/types/api.ts`, `src/types/index.ts`

**Spec:** Implement every enum from Tech Spec §3.1 and every interface from Tech Spec §3.2–3.7. Use strict TypeScript — no `any`. Export all from the barrel `index.ts`.

**Acceptance criteria:**
1. All enums from Tech Spec §3.1 defined with correct values.
2. All interfaces from Tech Spec §3.2–3.7 defined with correct field names and types.
3. `pnpm check` passes.
4. No `any` types.

### M1-WP02: Tauri IPC token command
**Complexity:** S | **Deps:** M0-WP01

**Objective:** Implement Rust-side IPC commands for reading the CAW bearer token per Tech Spec §12.

**Files:** `src-tauri/src/commands.rs`, modify `src-tauri/src/lib.rs`

**Spec:** Implement `read_api_token` and `get_token_path` commands per Tech Spec §12. `read_api_token` reads `~/.config/caw/api_key`, trims whitespace, returns the string. Returns an error if the file does not exist. `get_token_path` returns the expected path string.

**Acceptance criteria:**
1. `invoke("read_api_token")` returns the token string when the file exists.
2. `invoke("read_api_token")` returns an error when the file is missing.
3. `invoke("get_token_path")` returns the correct path.
4. `cargo check` passes.

### M1-WP03: HTTP client
**Complexity:** M | **Deps:** M1-WP01, M1-WP02

**Objective:** Implement the HTTP client per Tech Spec §5.

**Files:** `src/api/client.ts`

**Spec:** Implement per Tech Spec §5 behavioral spec. Wrap `ky` with bearer token from IPC. Typed wrapper methods: `get<T>`, `post<T>`, `patch<T>`, `del<T>`. Normalize errors. Emit auth_failed on 401.

**Acceptance criteria:**
1. Client attaches bearer token to all requests.
2. `get<T>` parses `ApiResponse<T>` correctly.
3. 401 response triggers auth_failed handling.
4. Network errors normalize to `{ errorCode, message }`.
5. `pnpm check` passes.

### M1-WP04: WebSocket manager
**Complexity:** M | **Deps:** M1-WP01, M1-WP02

**Objective:** Implement the WebSocket manager per Tech Spec §6.

**Files:** `src/api/ws.ts`

**Spec:** Implement per Tech Spec §6 behavioral spec. Token as query param. JSON-line parsing into StreamChunk. Exponential backoff reconnection. Status observable.

**Acceptance criteria:**
1. Connects with token as query parameter.
2. Parses JSON lines into StreamChunk objects.
3. Reconnects with exponential backoff on disconnect.
4. Status transitions: connecting → connected → disconnected.
5. `pnpm check` passes.

### M1-WP05: Endpoint functions
**Complexity:** L | **Deps:** M1-WP03

**Objective:** Implement all endpoint functions from Tech Spec §4.

**Files:** `src/api/endpoints.ts`, `src/api/index.ts`

**Spec:** Implement every function from the Tech Spec §4 table using the HTTP client. Each function is a thin typed wrapper: constructs the path, passes params, returns `Promise<ApiResponse<T>>`.

**Acceptance criteria:**
1. Every function from Tech Spec §4 exists and type-checks.
2. Correct HTTP method and path for each.
3. Query params, path params, and body params correctly mapped.
4. `pnpm check` passes.

---

## Milestone 2: State Management

**Goal:** All Zustand stores are operational and wired to the API layer.

### M2-WP01: Connection and UI stores
**Complexity:** S | **Deps:** M1-WP03

**Objective:** Implement connection and UI stores per Tech Spec §7.1 and §7.12.

**Files:** `src/stores/connection.ts`, `src/stores/ui.ts`

**Spec:** Implement state fields and actions per Tech Spec §7.1 and §7.12. Connection store manages backend reachability. UI store manages mode, sidebar, panels.

**Acceptance criteria:**
1. All state fields and actions from Tech Spec §7.1 and §7.12 implemented.
2. Mode switching updates `activeMode`.
3. Toggle actions flip boolean state.
4. `pnpm check` passes.

### M2-WP02: Session and message stores
**Complexity:** M | **Deps:** M1-WP05, M1-WP04

**Objective:** Implement session and message stores per Tech Spec §7.2 and §7.3.

**Files:** `src/stores/sessions.ts`, `src/stores/messages.ts`

**Spec:** Per Tech Spec §7.2 and §7.3. Session store fetches from API, manages active session. Message store manages per-session history and streaming buffer. `sendMessage` connects WS, streams chunks, finalizes on done.

**Acceptance criteria:**
1. `createSession` calls API and updates local state.
2. `fetchHistory` populates message list ordered by sequence.
3. `appendChunk` accumulates streaming text.
4. `finalizeStream` replaces buffer with completed message.
5. `pnpm check` passes.

### M2-WP03: Approval and provider stores
**Complexity:** S | **Deps:** M1-WP05

**Objective:** Implement approval and provider stores per Tech Spec §7.4 and §7.6.

**Files:** `src/stores/approvals.ts`, `src/stores/providers.ts`

**Spec:** Per Tech Spec §7.4 and §7.6. Approval store polls pending approvals, supports approve/deny actions. Provider store polls health.

**Acceptance criteria:**
1. `fetchPending` populates pending array.
2. `approve`/`deny` call API and remove from pending.
3. Provider health store fetches and stores health data.
4. `pnpm check` passes.

### M2-WP04: Trace and skill stores
**Complexity:** S | **Deps:** M1-WP05

**Objective:** Implement trace and skill stores per Tech Spec §7.5 and §7.7.

**Files:** `src/stores/traces.ts`, `src/stores/skills.ts`

**Spec:** Per Tech Spec §7.5 and §7.7. Trace store loads events by trace ID with filtering. Skill store loads skills and packs.

**Acceptance criteria:**
1. `fetchTrace` populates events keyed by traceId.
2. `setFilter` filters displayed event types.
3. Skill store loads skills and packs from API.
4. `pnpm check` passes.

### M2-WP05: Domain stores (research, deliberation, workspace, arena)
**Complexity:** M | **Deps:** M1-WP05

**Objective:** Implement remaining domain stores per Tech Spec §7.8–7.11.

**Files:** `src/stores/research.ts`, `src/stores/deliberation.ts`, `src/stores/workspace.ts`, `src/stores/arena.ts`, `src/stores/index.ts`

**Spec:** Per Tech Spec §7.8–7.11. Each store wraps its domain's endpoint functions with local state management. Barrel `index.ts` re-exports all stores.

**Acceptance criteria:**
1. All state fields and actions from Tech Spec §7.8–7.11 implemented.
2. Each action calls the correct API endpoint.
3. Loading states managed correctly.
4. `pnpm check` passes.

---

## Milestone 3: Shared Components

**Goal:** All shared UI primitives from Tech Spec §11.1 are built and usable.

### M3-WP01: Button, Badge, ConnectionIndicator
**Complexity:** M | **Deps:** M0-WP01

**Objective:** Build core shared components per Tech Spec §11.1.

**Files:** `src/components/shared/Button.tsx`, `src/components/shared/Badge.tsx`, `src/components/shared/ConnectionIndicator.tsx`, `src/components/shared/index.ts`

**Spec:** Implement props per Tech Spec §11.1. Use Tailwind classes mapped to design tokens. Button loading state shows 16px spinner SVG. Badge count > 99 shows "99+". ConnectionIndicator uses colored dot per status.

**Acceptance criteria:**
1. Button renders all four variants and three sizes.
2. Loading state shows spinner and disables click.
3. Badge renders count and pulse animation.
4. ConnectionIndicator renders correct color per status.
5. `pnpm check` passes.

### M3-WP02: Panel, TraceEventRow, Modal
**Complexity:** M | **Deps:** M0-WP01

**Objective:** Build Panel and TraceEventRow per Tech Spec §11.1.

**Files:** `src/components/shared/Panel.tsx`, `src/components/shared/TraceEventRow.tsx`, `src/components/shared/Modal.tsx`

**Spec:** Panel slides from specified edge per Tech Spec §11.1. TraceEventRow displays one-line event summary. Modal is a generic overlay with close button (used by approval detail, event detail).

**Acceptance criteria:**
1. Panel opens/closes with 150ms transition.
2. TraceEventRow shows timestamp, type badge, and truncated data.
3. Modal renders overlay with close on Escape and backdrop click.
4. `pnpm check` passes.

---

## Milestone 4: Shell

**Goal:** The global shell (sidebar, header, trace panel) is operational. Mode switching works.

### M4-WP01: Sidebar
**Complexity:** M | **Deps:** M2-WP01, M2-WP02, M3-WP01

**Objective:** Build Sidebar per Tech Spec §11.2.

**Files:** `src/components/shell/Sidebar.tsx`

**Spec:** Per Tech Spec §11.2. Six mode icons. Session list for active mode. Collapsible. Reads from UI and session stores.

**Acceptance criteria:**
1. Renders six mode icons.
2. Clicking icon switches mode via UI store.
3. Session list updates when mode changes.
4. Ctrl+B toggles collapse.
5. Collapsed width 48px, expanded 260px.

### M4-WP02: Header
**Complexity:** M | **Deps:** M2-WP01, M2-WP03, M3-WP01

**Objective:** Build Header per Tech Spec §11.2.

**Files:** `src/components/shell/Header.tsx`

**Spec:** Per Tech Spec §11.2. Editable session title. ConnectionIndicator. Provider health badge. Approval count badge with pulse.

**Acceptance criteria:**
1. Session title renders and is editable inline.
2. ConnectionIndicator reflects connection store.
3. Approval badge shows pending count, pulses when > 0.
4. Provider health badge shows aggregate status.

### M4-WP03: Trace panel
**Complexity:** M | **Deps:** M2-WP04, M3-WP02

**Objective:** Build TracePanel per Tech Spec §11.2.

**Files:** `src/components/shell/TracePanel.tsx`

**Spec:** Per Tech Spec §11.2. Collapsible bottom panel (240px open, 0 closed). Renders TraceEventRow list. Filter dropdown for event types. Ctrl+T toggles.

**Acceptance criteria:**
1. Panel opens/closes with transition.
2. Events render in chronological order.
3. Filter narrows displayed events.
4. Clicking event opens detail modal.

### M4-WP04: App shell assembly
**Complexity:** M | **Deps:** M4-WP01, M4-WP02, M4-WP03

**Objective:** Assemble the full shell layout and wire keyboard shortcuts per Tech Spec §9.

**Files:** `src/App.tsx`, `src/hooks/useKeyboardShortcuts.ts`, `src/hooks/usePolling.ts`

**Spec:** App.tsx renders Sidebar + Header + mode content area + TracePanel. `useKeyboardShortcuts` registers all shortcuts from Tech Spec §9. `usePolling` manages the three polling intervals from Tech Spec §8.

**Acceptance criteria:**
1. All six modes render a placeholder when selected.
2. Ctrl+1–6 switches modes.
3. Ctrl+N creates new session.
4. Polling starts on mount, stops on unmount.
5. Approval polling at 2s, health at 10s, session at 5s.

---

## Milestone 5: Chat Mode

**Goal:** End-to-end chat with streaming works through the full stack.

### M5-WP01: ChatView
**Complexity:** L | **Deps:** M4-WP04, M2-WP02

**Objective:** Build the Chat mode view per Tech Spec §11.3.

**Files:** `src/components/chat/ChatView.tsx`, `src/components/chat/MessageList.tsx`, `src/components/chat/MessageBubble.tsx`, `src/components/chat/ChatInput.tsx`

**Spec:** Per Tech Spec §11.3. MessageList auto-scrolls. MessageBubble renders user/assistant messages with role styling. ChatInput is a textarea with send button. Ctrl+Enter sends. Streaming indicator during active stream.

**Acceptance criteria:**
1. Messages render with correct role styling.
2. New messages trigger auto-scroll.
3. Sending a message initiates WebSocket stream.
4. Streaming text appears incrementally.
5. Done signal finalizes the message.
6. Ctrl+Enter sends from textarea.

---

## Milestone 6: Approval Panel

**Goal:** Approval gates surface correctly and can be actioned.

### M6-WP01: Approval panel
**Complexity:** M | **Deps:** M4-WP02, M2-WP03, M3-WP02

**Objective:** Build the approval slide-in panel per Design Doc §7.

**Files:** `src/components/shell/ApprovalPanel.tsx`, `src/components/shared/ApprovalCard.tsx`

**Spec:** Right-side Panel showing pending ApprovalRequests. Each ApprovalCard shows action, resources, reversibility, preview. Approve/Deny buttons. Ctrl+Shift+A toggles.

**Acceptance criteria:**
1. Panel slides in from right.
2. Each request renders with all fields.
3. Approve calls API, removes from list.
4. Deny calls API, removes from list.
5. Badge in header updates immediately.

---

## Milestone 7: Research Mode

**Goal:** Full research workflow: ingest, retrieve, synthesize, export.

### M7-WP01: ResearchView
**Complexity:** L | **Deps:** M4-WP04, M2-WP05

**Objective:** Build the Research mode view per Tech Spec §11.3.

**Files:** `src/components/research/ResearchView.tsx`, `src/components/research/SourcePanel.tsx`, `src/components/research/SynthesisPanel.tsx`, `src/components/research/CitationPanel.tsx`

**Spec:** Three-column layout per Tech Spec §11.3. SourcePanel shows ingested sources with ingest button. SynthesisPanel shows query input and synthesis output with inline citation highlights. CitationPanel shows source excerpt when a citation is clicked.

**Acceptance criteria:**
1. Source ingestion triggers API call and updates source list.
2. Query triggers retrieval + synthesis pipeline.
3. Citations in synthesis output are clickable.
4. Clicking citation shows source excerpt in CitationPanel.
5. Export button produces artifact in selected format.

---

## Milestone 8: Deliberation Mode

**Goal:** Multi-frame deliberation with rhetoric analysis renders correctly.

### M8-WP01: DeliberationView
**Complexity:** L | **Deps:** M4-WP04, M2-WP05

**Objective:** Build the Deliberation mode view per Tech Spec §11.3.

**Files:** `src/components/deliberation/DeliberationView.tsx`, `src/components/deliberation/FrameCard.tsx`, `src/components/deliberation/DisagreementPanel.tsx`, `src/components/deliberation/RhetoricPanel.tsx`

**Spec:** Horizontal frame cards per Tech Spec §11.3. Below: tabbed panel (disagreement surface, rhetoric analysis, synthesis). FrameCard shows label, position text, critique threads. DisagreementPanel renders agreements/disagreements/open questions. RhetoricPanel renders devices, biases, inconsistencies with severity badges.

**Acceptance criteria:**
1. Frame cards render for each frame in the result.
2. Critique threads display under each frame.
3. Disagreement surface tab shows structured data.
4. Rhetoric tab shows devices with severity coloring.
5. Configuration form allows setting frames, rounds, options.

---

## Milestone 9: Workspace Mode

**Goal:** File browsing, viewing, diffs, patches, and command execution.

### M9-WP01: WorkspaceView
**Complexity:** L | **Deps:** M4-WP04, M2-WP05, M6-WP01

**Objective:** Build the Workspace mode view per Tech Spec §11.3.

**Files:** `src/components/workspace/WorkspaceView.tsx`, `src/components/workspace/FileBrowser.tsx`, `src/components/workspace/FileViewer.tsx`, `src/components/workspace/DiffViewer.tsx`, `src/components/workspace/CommandBar.tsx`, `src/components/workspace/PatchReview.tsx`

**Spec:** Two-panel layout per Tech Spec §11.3. FileBrowser navigates directories via workspace store. FileViewer displays file content with monospace font. DiffViewer renders unified diff. PatchReview shows hunks with inline approve/deny (routes through approval store). CommandBar at bottom: input + output display. All write/execute operations route through approval gates.

**Acceptance criteria:**
1. Directory listing loads and displays files.
2. Clicking a file opens it in FileViewer.
3. Diff view renders hunks with +/- coloring.
4. Patch proposals show approve/deny buttons.
5. Command execution submits through approval gate.
6. Command output displays in CommandBar.

---

## Milestone 10: Arena Mode

**Goal:** Eval runs, comparison, and scoring dashboard.

### M10-WP01: ArenaView
**Complexity:** M | **Deps:** M4-WP04, M2-WP05

**Objective:** Build the Arena mode view per Tech Spec §11.3.

**Files:** `src/components/arena/ArenaView.tsx`, `src/components/arena/RunTable.tsx`, `src/components/arena/ComparisonPanel.tsx`, `src/components/arena/ScoreChart.tsx`

**Spec:** Task selector, run table, comparison panel per Tech Spec §11.3. RunTable lists eval runs with status, scores. ComparisonPanel shows side-by-side when two+ runs selected. ScoreChart renders per-dimension score bars (simple CSS bars, no charting library required for v1).

**Acceptance criteria:**
1. Task selector loads available tasks from eval runs.
2. Run table displays runs with scores.
3. Selecting runs enables comparison.
4. Comparison shows per-dimension score bars.

---

## Milestone 11: Replay Mode

**Goal:** Trace timeline, event detail, run summary, and run diff.

### M11-WP01: ReplayView
**Complexity:** M | **Deps:** M4-WP04, M2-WP04

**Objective:** Build the Replay mode view per Tech Spec §11.3.

**Files:** `src/components/replay/ReplayView.tsx`, `src/components/replay/Timeline.tsx`, `src/components/replay/EventDetail.tsx`, `src/components/replay/RunSummaryCard.tsx`

**Spec:** Timeline scrubber, event list, event detail, run summary per Tech Spec §11.3. Timeline shows events as dots on a horizontal axis. Clicking an event shows full detail in EventDetail panel. RunSummaryCard shows counts (provider calls, tool calls, errors, duration).

**Acceptance criteria:**
1. Timeline renders events chronologically.
2. Clicking event shows detail panel.
3. Run summary card shows correct counts.
4. Event type filter works.

---

## Milestone 12: Integration and Polish

**Goal:** Cross-cutting integration, error states, loading states, AppImage build.

### M12-WP01: Error and loading states
**Complexity:** M | **Deps:** M5-WP01 through M11-WP01

**Objective:** Add consistent error and loading states across all views.

**Files:** `src/components/shared/ErrorBanner.tsx`, `src/components/shared/LoadingSpinner.tsx`, modifications to all mode views.

**Spec:** ErrorBanner displays API errors with error code and message, dismiss button. LoadingSpinner centered in content area during fetches. Every store's `loading` state drives spinner display. Connection loss shows persistent banner in header area.

**Acceptance criteria:**
1. API errors display in ErrorBanner.
2. Loading states show spinner.
3. Connection loss shows persistent warning.
4. Errors are dismissible.

### M12-WP02: AppImage build configuration
**Complexity:** S | **Deps:** M0-WP01

**Objective:** Configure Tauri to produce an AppImage for Ubuntu 24.04.

**Files:** `src-tauri/tauri.conf.json` modifications, `.github/workflows/build.yml` (optional)

**Spec:** Configure Tauri bundler targets to include AppImage. Set minimum WebKitGTK version. Verify build produces a functional `.AppImage` file.

**Acceptance criteria:**
1. `pnpm tauri build` produces an AppImage.
2. AppImage launches on Ubuntu 24.04.
3. App connects to a running CAW backend.

### M12-WP03: Version bump to 1.0.0
**Complexity:** S | **Deps:** M12-WP01, M12-WP02

**Objective:** Bump all version strings to 1.0.0 and finalize CHANGELOG.

**Files:** `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `CHANGELOG.md`

**Spec:** Update version to `1.0.0` in all three locations per Tech Spec §13. Move all CHANGELOG entries from `[Unreleased]` to `[1.0.0]` with release date.

**Acceptance criteria:**
1. All three version locations read `1.0.0`.
2. CHANGELOG has `[1.0.0]` section with date.
3. `[Unreleased]` section is empty.
4. `pnpm check` passes.
5. `cargo check` passes.
