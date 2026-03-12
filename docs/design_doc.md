# Stoa Web GUI - Design Document

## 1. Project Overview
`stoa-gui` is the visual frontend for the Stoa Canonical Agent Workbench. While the `stoa` backend handles LLM orchestration, tool execution, and state management, `stoa-gui` provides a human-in-the-loop (HITL) interface. It allows users to manage agent sessions, monitor capability execution in real-time, and configure workspace skills without using a CLI or raw REST calls.

## 2. Goals & Non-Goals
**Goals:**
- Provide a responsive, chat-like interface for interacting with Stoa agents.
- Visualize the "thought process" and tool execution (skills) of the agent.
- Manage multiple concurrent agent sessions.
- Securely proxy requests to the Stoa VPS (`37.60.240.152`).

**Non-Goals:**
- Rebuilding agent logic or LLM routing (handled by `stoa` backend).
- Complex multi-tenant user authentication (this is a single-tenant/internal tool for now).

## 3. User Experience (UX) & Layout
The application will follow a classic IDE/Workbench layout:
- **Left Sidebar (Session Manager):** List of active and historical sessions. Button to create a "New Session".
- **Main Content Area (The Arena):**
  - **Top:** Session metadata (ID, active model, status).
  - **Middle:** Scrollable feed of interactions (User Prompts, Agent Responses, Tool Execution Logs).
  - **Bottom:** Input area with a textarea for prompts, attachment buttons, and a "Stop Generation" interrupt button.
- **Right Sidebar (Inspector - Collapsible):** Displays available skills, active capabilities, and raw JSON payloads for debugging.

## 4. Security & Network Design
The Stoa backend resides at `37.60.240.152`. To prevent CORS vulnerabilities and hide potential API keys from the browser, `stoa-gui` will utilize the Next.js Node.js server as a proxy.
`Browser -> Next.js API Route (/api/proxy/*) -> Stoa VPS (37.60.240.152:8420)`
