# Stoa Standard Workflow (Operator-Grade)

This is the canonical protocol for engineering Stoa. Adherence is mandatory to maintain the "zero-intelligence," high-density, and consistent architecture required for operator-grade tools.

## Phase 1: Context & Branching
1.  **Verification:** Confirm current milestone and project status via `git log` and directory audit. Never rely on session memory alone.
2.  **Branching:** Always branch from `main` or the current stable target using `feat/m{milestone}-{description}`.
    *   `git checkout -b feat/m7-replay-mode`

## Phase 2: Implementation Sequence
1.  **Types/Interfaces:** Define backend-aligned TypeScript interfaces in `src/types/`.
2.  **State (Zustand):** Implement or extend stores in `src/stores/`. Focus on pure actions and predictable state transitions.
3.  **API/IPC:** Map Rust-side commands and WebSocket events in `src/api/` and `src-tauri/src/`.
4.  **Components:** 
    *   Build atomic/shared units in `src/components/shared/` first.
    *   Assemble mode-specific views in `src/components/{mode}/`.
    *   **UI Rules:** High-density, Zinc-base, monospace for data, minimal whitespace.
5.  **Wiring:** Mount and wire components to the stores in `App.tsx` or main mode containers.

## Phase 3: Verification & Submission
1.  **Code Quality:** Ensure `tsc --noEmit` is clean. 
2.  **Commit:** Use precise, milestone-aligned messages.
    *   `feat: replay mode implementation (Milestone 7)`
3.  **Pull Request (PR):** **Mandatory.** Before presenting work to the Human, a PR must be generated via the `gh` CLI.
    *   `gh pr create --title "feat: Milestone 7 - Replay Mode" --body "Implementation of WP19-WP20..."`
4.  **Presentation:** Report status and provide the PR link for evaluation.

## Persistence
- This workflow is documented in `stoa-gui/docs/WORKFLOW.md`.
- Significant updates to this protocol must be reflected in documentation immediately.
- On session reset, read this file first. ❄️
