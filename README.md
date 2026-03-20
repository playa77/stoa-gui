# Stoa

**Version:** 0.1.0
**Target:** Ubuntu 24.04 (AppImage)
**Backend:** Canonical Agent Workbench (CAW)

Stoa is a native Linux desktop GUI client for the **Canonical Agent Workbench (CAW)**. It is designed as a pure API client with zero embedded backend logic, focusing instead on providing a high-density, operator-grade interface for complex AI orchestration, research, and deliberation.

## Design Philosophy

- **Zero Intelligence:** Stoa renders and routes. All cognitive work, reasoning, and synthesis reside in the CAW backend.
- **Operator-Grade Density:** Practicality over whitespace. Designed for power users who require immediate access to traces, approval gates, and multi-mode workflows.
- **Connection Honesty:** Real-time visibility into backend health, provider status, and pending human-in-the-loop approvals.
- **Approval Gates as First-Class UI:** Security is not a sidebar. Approval requests for file operations and command execution are persistent and unmissable.

## Core Modes

1.  **Chat:** Streaming conversational interface with multi-provider support.
2.  **Research:** Multi-column source ingestion, retrieval, and synthesis with inline citations.
3.  **Deliberation:** Multi-frame agent debate and rhetoric analysis interface.
4.  **Workspace:** Local/remote file browser with integrated diff viewing and patch approval.
5.  **Arena:** Side-by-side model evaluation and regression tracking.
6.  **Replay:** Granular trace event inspection and execution history.

## Tech Stack

- **Shell:** Tauri 2 (Rust + WebKitGTK)
- **Frontend:** React 19 + TypeScript 5 (Strict)
- **State:** Zustand 5
- **Styling:** Tailwind CSS 4 (Design Token Mapped)
- **IPC:** Secure Rust-side bearer token handling (no `localStorage`)

## Development

### Prerequisites

- Rust 1.80+ (Stable)
- Node.js 22 LTS
- WebKit2GTK 4.1 dev headers

### Building

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build production AppImage
npm run tauri build
```

## Versioning

This project follows **Semantic Versioning 2.0.0**. Version strings in `package.json`, `tauri.conf.json`, and `Cargo.toml` are updated atomically. 

## License

MIT © 2026 playa77
