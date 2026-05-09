# ofcourse

![CI](https://github.com/adityachandak287/ofcourse/actions/workflows/ci.yml/badge.svg?branch=main)

Client-side GPA calculator and course planning helper for Cornell students.

## Why this project exists

A lightweight SPA for exploring Cornell roster data and quickly estimating term GPA with Cornell-specific grading rules.

## What the app does

- Fetches Cornell rosters, subjects, and classes through a browser-safe proxy path (`/api/*`)
- Lets users search courses, add them to a plan, and set credits/grades for GPA simulation
- Computes weighted GPA using Cornell's 4.3 scale and quality points
- Excludes non-GPA grades such as `S/U` from GPA calculations
- Uses cached query data for a smoother roster browsing experience

## Tech stack

- Runtime/package manager: Bun
- Frontend: React 19 + TypeScript + Vite
- Routing: wouter
- Data fetching/cache: TanStack React Query
- UI: Tailwind v4 + shadcn/ui
- Tooling: ESLint, Prettier, Vitest, GitHub Actions

## Prerequisites

- Bun installed locally ([install docs](https://bun.sh/docs/installation))

## Local development

```bash
bun install
bun run dev
```

## Build, test, and checks

```bash
bun run test:run
bun run lint
bun run format:check
bun run build
```

CI runs format check, lint, AI scan, unit tests, and build on pull requests and pushes to `main`.

## Project structure

- `src/pages/**`: route-level composition and page wiring
- `src/features/**`: feature logic (query hooks, adapters, feature components)
- `src/lib/**`: pure logic and shared primitives (no React imports)
- `src/components/ui/**`: generated shadcn primitives (treat as upstream-generated)
- `src/components/**`: app-level wrappers and composition around UI primitives

## Cornell roster API and proxy flow

Cornell's roster API does not include CORS headers, so browser code must call relative `/api/*` endpoints only.

Example request from the app:

- `GET /api/search/classes.json?roster=SP26&subject=CS`

In production, Netlify rewrites `/api/*` to `https://classes.cornell.edu/api/2.0/*` using `netlify.toml`.

Reference: [Netlify rewrites and proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)

## GPA policy

- Uses Cornell's 4.3 scale (`A+ = 4.3`)
- Computes weighted GPA from quality points and graded credits
- Excludes `S/U` from GPA
- Ignores invalid credit inputs (for example non-finite or non-positive credits)

## Testing scope

- Unit tests cover core GPA math in `src/lib/gpa/**`
- CI enforces formatting, linting, tests, and build integrity

## Contributing

- Use Bun commands only (`bun`, `bunx --bun`)
- Keep API calls in browser code on `/api/*` (never direct Cornell origin fetches)
- Do not customize `src/components/ui/*` directly
- Prefer small, focused PRs with clear Conventional Commit messages

## Cursor governance

- Rules: `.cursor/rules/*.mdc`
- Project workflow skill: `.cursor/skills/gpa-frontend-workflow/SKILL.md`
- Hook: `.cursor/hooks/enforce-bun-only.sh` helps enforce Bun-only usage
- Non-Cursor agents should follow `AGENTS.md` for canonical policy routing
