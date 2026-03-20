# Stoa Implementation Guide

**Version:** 1.0.0
**Date:** 2026-03-16
**Companion to:** Stoa Technical Specification v1.0.0, Stoa Atomic Roadmap v1.0.0

---

## 1. Environment Prerequisites

```bash
# System packages (Ubuntu 24.04)
sudo apt update && sudo apt install -y \
  build-essential curl wget file \
  libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup update stable

# Node.js 22 LTS (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source "$HOME/.nvm/nvm.sh"
nvm install 22
nvm use 22

# pnpm
corepack enable
corepack prepare pnpm@latest --activate

# Tauri CLI
cargo install tauri-cli@^2
```

---

## 2. Project Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install JS dependencies |
| `pnpm dev` | Start Tauri dev server (hot reload) |
| `pnpm check` | TypeScript type check (`tsc --noEmit`) |
| `pnpm lint` | ESLint check |
| `pnpm format` | Prettier format |
| `pnpm test` | Run Vitest |
| `pnpm tauri build` | Production build (AppImage) |
| `cargo check --manifest-path src-tauri/Cargo.toml` | Rust type check |

---

## 3. Canonical Patterns

### 3.1 Component Pattern

```tsx
import { type FC } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  );
};
```

### 3.2 Store Pattern

```ts
import { create } from "zustand";
import { listProviders, getProviderHealth } from "@/api/endpoints";
import type { ProviderHealth } from "@/types";

interface ProviderStore {
  providers: ProviderHealth[];
  lastChecked: string | null;
  fetchHealth: () => Promise<void>;
}

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],
  lastChecked: null,
  fetchHealth: async () => {
    const res = await listProviders();
    if (res.status === "ok" && res.data) {
      set({ providers: res.data, lastChecked: new Date().toISOString() });
    }
  },
}));
```

### 3.3 Test Pattern

```ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("disables when loading", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## 4. WP Execution Protocol

1. **Read the WP** in the Roadmap. Note dependencies, files, and acceptance criteria.
2. **Consult the Tech Spec** for all referenced sections (types, store shapes, component props, tokens).
3. **Implement** following the canonical patterns above. Every file gets an export in its directory's barrel `index.ts`.
4. **Verify** every acceptance criterion. Run `pnpm check` and `pnpm test`.

---

## 5. Transfer Prompt Template

When delegating a WP to a weak coder:

```
You are implementing work package {WP_ID} for Stoa, a Tauri 2 + React 19 + TypeScript 5 desktop app.

## Context
- Read Tech Spec sections: {list referenced sections}
- Dependencies completed: {list dep WP IDs}

## Deliverables
Create these files: {list from WP}

## Specification
{paste WP spec section verbatim}

## Acceptance Criteria
{paste WP acceptance criteria verbatim}

## Constraints
- TypeScript strict mode. No `any`.
- Use Tailwind CSS classes mapped to CSS custom properties in index.css.
- Follow the component/store/test patterns from Impl Guide §3.
- Export from barrel index.ts in each directory.
- Run `pnpm check` — must pass.
```

---

## 6. Quick Reference

**Directory map:**

```
src/api/         → HTTP client, WS manager, endpoint functions
src/stores/      → Zustand stores (one per domain)
src/components/  → React components (shell/ + mode dirs + shared/)
src/hooks/       → Custom hooks (usePolling, useKeyboardShortcuts)
src/types/       → TypeScript type definitions
src/lib/         → Utilities, constants, formatters
src-tauri/       → Rust shell, IPC commands
```

**Commands:**

```
pnpm dev         → dev server
pnpm check       → type check
pnpm test        → tests
pnpm lint        → lint
pnpm tauri build → AppImage
```
