# stoa-gui

Desktop GUI for operating and observing **Stoa** agent workflows through a Tauri + React frontend. The app is a multi-mode shell (Chat, Research, Deliberation, Workspace, Arena, Replay) with session navigation, streaming chat, approval inbox, and trace timeline panels.

---

## Project status

This repository is an actively scaffolded client:

- **Implemented and usable now**
  - Tauri desktop shell + React/Vite frontend bootstrapping.
  - Session list, mode switching UI, active session header.
  - Chat view with message history loading and WebSocket streaming.
  - Approval panel and trace panel scaffolding.
  - Polling loops for approvals/provider health.
- **Partially implemented / placeholders**
  - Research, Deliberation, Workspace, Arena, and Replay main views still render placeholders in the center pane.
  - Some polling/update loops are marked with TODO comments and not yet wired to full backend refresh behavior.

If you are evaluating readiness: the app is best considered an early integration client with the Chat path furthest along.

---

## Tech stack

- **Desktop host:** Tauri v2 (Rust)
- **Frontend:** React 19 + TypeScript + Vite 7
- **State management:** Zustand
- **Styling:** Tailwind CSS v4 + custom design tokens
- **HTTP client:** `ky`
- **Icons:** `lucide-react`

---

## Runtime architecture

The app expects a running backend service and communicates in two ways:

1. **REST API** at `http://localhost:8420/api/v1`
   - sessions, messages, approvals, traces, workspace, research, evaluation, skills, providers.
2. **WebSocket stream** at `ws://localhost:8420/api/v1/sessions/:id/stream`
   - incremental assistant output chunks and approval-required events.

Authentication is injected using a bearer token read from a local file by Tauri IPC:

- token path: `~/.config/caw/api_key`

---

## Prerequisites

Install the following before running locally:

1. **Node.js** (current LTS recommended)
2. **pnpm**
3. **Rust toolchain** (stable) and Cargo
4. **Tauri system dependencies** for your OS (WebView/runtime requirements)
5. A compatible **Stoa backend API** listening on `localhost:8420`
6. API token file at:

```bash
~/.config/caw/api_key
```

> The file should contain only your token value (newline is fine; it is trimmed).

---

## Quick start

```bash
# 1) Install JS dependencies
pnpm install

# 2) Run frontend-only dev server
pnpm dev

# 3) Run desktop app (spawns frontend dev server via Tauri config)
pnpm tauri dev
```

Production build:

```bash
# Frontend bundle
pnpm build

# Tauri production bundle
pnpm tauri build
```

Type-check only:

```bash
pnpm check
```

---

## NPM scripts

- `pnpm dev` — Vite dev server
- `pnpm build` — TypeScript compile + Vite production build
- `pnpm preview` — Preview production frontend build
- `pnpm tauri` — Proxy to Tauri CLI (`pnpm tauri dev`, `pnpm tauri build`, etc.)
- `pnpm check` — TypeScript no-emit type check

---

## Repository layout

```text
.
├─ src/                     # React app
│  ├─ api/                  # REST + WebSocket clients
│  ├─ components/           # Shell, chat, shared UI blocks
│  ├─ hooks/                # Polling and keyboard hooks
│  ├─ stores/               # Zustand state slices
│  ├─ types/                # Domain and API types
│  └─ App.tsx               # Mode shell and main layout
├─ src-tauri/               # Tauri/Rust host application
│  ├─ src/commands.rs       # IPC commands (read token path/value)
│  ├─ src/lib.rs            # Tauri builder + command registration
│  └─ tauri.conf.json       # Build/dev/bundle configuration
└─ README.md
```

---

## Current behavior by mode

- **Chat:** functional session chat UI with history fetch and stream output.
- **Research:** placeholder panel currently rendered.
- **Deliberation:** placeholder panel currently rendered.
- **Workspace:** placeholder panel currently rendered.
- **Arena/Eval:** placeholder panel currently rendered.
- **Replay:** placeholder panel currently rendered.

---

## Troubleshooting

### App starts but cannot talk to backend

- Verify backend is running on `http://localhost:8420`.
- Verify API routes are served under `/api/v1`.
- Check browser/Tauri devtools network tab for 401/404/500 responses.

### Authentication failures

- Ensure token file exists at `~/.config/caw/api_key`.
- Confirm file is readable by your user.
- Ensure token is valid for the target backend environment.

### WebSocket does not stream

- Verify backend stream endpoint supports:
  `ws://localhost:8420/api/v1/sessions/<session-id>/stream?token=<token>`
- Watch console for reconnect loop or parse errors.

---

## Notes for contributors

- The UI intentionally uses strict mode and centralized Zustand slices.
- Keep endpoint shapes aligned with `src/types/*` and `src/api/endpoints.ts`.
- If you implement non-Chat modes, prefer incremental PRs by mode and keep placeholder text until fully wired.

