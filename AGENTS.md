# Agent Instructions (Non-Cursor)

This repository uses Cursor-native policy files as the single source of truth.

Canonical policy locations:
- `.cursor/rules/*.mdc`
- `.cursor/skills/**/SKILL.md`
- `.cursor/hooks.json` and scripts under `.cursor/hooks/` (for shell-command guardrails)

## Required startup behavior

When working in this repo, non-Cursor agents should:
1. Read all files in `.cursor/rules/` before proposing or applying code changes.
2. Treat rules with `alwaysApply: true` as global constraints.
3. Apply glob-scoped rules only when the target files match each rule's `globs`.
4. If task scope matches a skill in `.cursor/skills/`, load and follow that skill workflow.
5. Respect hook intent even if hooks are not executed by your runtime.

## Precedence and conflict handling

Use this precedence order:
1. System/developer/user instructions in the current session.
2. `.cursor/rules/*` with `alwaysApply: true`.
3. Matching glob-based `.cursor/rules/*`.
4. Relevant `.cursor/skills/*/SKILL.md` guidance.
5. Hook guidance from `.cursor/hooks.json` and `.cursor/hooks/*`.

If two Cursor rules conflict, prefer the more specific rule (narrower glob or more direct constraint).

## Current repo non-negotiables (quick reference)

- Use `bun`/`bunx --bun`; avoid `npm`, `npx`, `pnpm`, and `yarn`.
- For Cornell roster data in browser code, use Netlify proxy path `/api/*`; do not call `classes.cornell.edu` directly.
- Do not directly customize `src/components/ui/*`; customize via wrappers/composition/theme tokens.
- Keep architecture boundaries: route composition in `src/pages/**`, feature logic in `src/features/**`, pure logic in `src/lib/**`.
- Propose commit messages per completed step, but do not create commits unless explicitly asked.

## Maintenance rule

Do not duplicate policy text elsewhere. Update Cursor files first; this file should remain a thin router plus quick-reference constraints.
