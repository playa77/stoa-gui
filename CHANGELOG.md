# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Milestone 4: Shell.
  - Sidebar with mode switcher and session list.
  - Header with session title, connection status, and approval/health badges.
  - TracePanel for chronological event viewing.
  - Keyboard shortcuts hook (Ctrl+1-6, Ctrl+N, Ctrl+B, Ctrl+T, Ctrl+Shift+A).
  - Polling hook for background API synchronization.
  - Full App shell assembly in App.tsx.
- Milestone 3: Shared Components.
  - Core UI primitives: Button, Badge, ConnectionIndicator, Panel, TraceEventRow, Modal.
  - Full support for variants, sizes, and states (loading, disabled, pulsing).
  - Integration with Tailwind 4 and Lucide icons.
- Milestone 2: State Management with Zustand stores.
  - Connection, UI, Session, Message, Approval, Trace, Research, Deliberation, Workspace, and Arena stores.
  - Wired stores to the API layer endpoint functions.
  - Implemented WebSocket-based message streaming in useMessageStore.
- Milestone 1: API Layer implementation.
  - Full TypeScript type definitions.
  - Tauri Rust IPC for token management.
  - Ky-based HTTP client and class-based WebSocket manager.
- Project bootstrap using Tauri 2, React 19, and TypeScript 5.
