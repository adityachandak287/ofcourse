---
name: gpa-frontend-workflow
description: Enforces the GPA calculator SPA workflow (Bun-only, shadcn-only, Netlify proxy for Cornell API, propose commit message per completed step). Use when implementing GPA features, Cornell roster API fetching/caching, routing, or shadcn UI composition in this repo.
---

# GPA frontend workflow

## Non-negotiables

- **Bun only**: use `bun` / `bunx --bun` for installs and CLIs.
- **shadcn preset**: initialize/apply with `--preset bd1jr62c`.
- **No direct edits** to `src/components/ui/*` for customization.
- **Cornell API via Netlify proxy** only: `/api/*`.

## Implementation pattern

- Put route-level composition in `src/pages/**`.
- Put React Query hooks and API adapters in `src/features/**`.
- Put pure GPA math and mappings in `src/lib/**` (no React imports).

## After each completed step/todo

- **Propose a commit message** (1-2 lines, explain intent/why).
- **Do not commit automatically** unless the user explicitly asks.

