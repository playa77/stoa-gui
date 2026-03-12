# Stoa Web GUI - Technical Specification

## 1. Technology Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS + CSS Modules (where necessary)
- **UI Components:** shadcn/ui (Radix UI primitives) + Lucide React (Icons)
- **State Management:**
  - Server State: TanStack Query v5 (React Query)
  - Client Global State: Zustand
- **Validation:** Zod

## 2. API Interface Mapping (Stoa Backend)
The Next.js backend will map to the Stoa REST API. All requests to the VPS must include appropriate error handling and timeout fallbacks.

| Stoa Backend Endpoint (VPS) | Next.js Proxy Route | Description |
| :--- | :--- | :--- |
| `POST /api/v1/sessions` | `POST /api/sessions` | Initialize a new agent session. |
| `GET /api/v1/sessions` | `GET /api/sessions` | List all sessions. |
| `GET /api/v1/sessions/{id}` | `GET /api/sessions/[id]` | Get session history/state. |
| `POST /api/v1/sessions/{id}/capabilities` | `POST /api/sessions/[id]/capabilities` | Send a prompt/trigger action. |
| `GET /api/v1/skills` | `GET /api/skills` | List available tools/skills. |
