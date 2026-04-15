---
name: CU API Client Refactor Plan
overview: Refactor the Cornell roster API client into a minimal, composable type system and a unified fetch layer, aligned with the three documented endpoints and Netlify proxy constraints.
todos:
  - id: define-core-api-types
    content: Consolidate response envelope + minimal endpoint payload types into a single composable file in src/lib/api, with intentionally small surface area.
    status: completed
  - id: refactor-client-functions
    content: Introduce a shared fetch helper and update all three API client functions to use the composable types and proxy paths.
    status: completed
  - id: migrate-consumers
    content: Update current callers and query hooks to use the new types and return shapes; remove redundant type files if unused.
    status: completed
  - id: verify-integrity
    content: Confirm endpoint coverage vs examples.md and ensure proxy-only calls with minimal payload usage.
    status: pending
isProject: false
---

# CU API Client Refactor Plan

## Goals
- Establish one composable API type module for responses and endpoint payloads.
- Minimize payload types to only what the app uses; ignore unused fields.
- Remove repetition across types and client functions.
- Keep all browser calls routed through `/api/*` (Netlify proxy).

## Inputs
- API examples and error shape in `src/lib/api/examples.md`.
- Existing API files in `src/lib/api`.
- Current consumers in `src/features` and `src/pages`.

## Plan

### 1) Composable types (single source)
- Update or extend `src/lib/api/cornellRosterApiTypes.ts` to hold:
  - `CornellApiSuccess<TData>`, `CornellApiError`, `CornellApiResponse<TData>`.
  - Small shared primitives (`RosterCode`, `SubjectCode`).
  - Minimal endpoint payloads for the three APIs:
    - rosters: `slug`, `descr`, `isDefaultRoster`.
    - subjects: `value`, `descr`.
    - classes: `crseId`, `crseOfferNbr`, `subject`, `catalogNbr`, `titleShort`, `titleLong`, `enrollGroups.unitsMinimum/unitsMaximum`.
  - Endpoint response aliases built from the shared envelope.

### 2) Client refactor (unified fetch)
- Introduce a shared helper in `src/lib/api/cornellRosterClient.ts` that:
  - builds `/api/*` URLs
  - handles HTTP errors and API `status: error`
  - returns typed payloads
- Implement all three functions using the helper:
  - `fetchCornellRosters`
  - `fetchCornellSubjectsByRoster`
  - `fetchCornellClassesByRosterAndSubject`

### 3) Consumer migration
- Update existing call sites and hooks to use the new types:
  - `src/features/courses/queries.ts`
  - `src/features/courses/courseLabel.ts`
  - `src/pages/gpa/GpaPage.tsx`
- Remove `src/lib/api/cornellRosterTypes.ts` if no longer referenced.

### 4) Verification
- Check all three endpoints are represented from `src/lib/api/examples.md`.
- Ensure no direct `classes.cornell.edu` calls from browser code.
- Confirm UI still derives labels and credits from the minimal types.

## Notes
- Keep type surface intentionally minimal; ignore any fields not used by the app.
- No changes to `src/components/ui/*`.
- Use `bun` if any scripts/tests are run.
