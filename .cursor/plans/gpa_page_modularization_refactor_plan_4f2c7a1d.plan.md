---
name: GPA Page Modularization Refactor Plan
overview: Break down GpaPage responsibilities into focused hooks/components to improve maintainability, reduce duplication, and make behavior easier to test without changing product behavior.
todos:
  - id: extract-url-filter-hook
    content: Extract query-param roster/subject parsing, normalization, and sync logic into a dedicated hook (e.g. useGpaFiltersInUrl).
    status: pending
    priority: p0
  - id: extract-roster-storage-hook
    content: Extract roster-scoped selected-course localStorage hydration/persistence and restore-toast lifecycle into a dedicated hook.
    status: pending
    priority: p0
  - id: extract-filters-component
    content: Split roster/subject combobox UI and interactions into a dedicated feature component (e.g. src/features/gpa/components/GpaFilters.tsx).
    status: pending
    priority: p0
  - id: dedupe-combobox-status-ui
    content: DRY loading/error/retry/empty dropdown states for roster/subject comboboxes into reusable UI helpers.
    status: pending
    priority: p1
  - id: extract-command-row-layout-helpers
    content: Centralize command-row code-column sizing and wrapped-label layout helpers used across roster/subject/course lists.
    status: pending
    priority: p1
  - id: consider-course-state-reducer
    content: If course state logic keeps growing, migrate add/remove/update handlers to a reducer or dedicated hook.
    status: pending
    priority: p2
  - id: add-tests-for-pure-helpers
    content: Add targeted tests for storage parsing/validation, normalization utilities, and dynamic width calculation.
    status: pending
    priority: p2
isProject: false
---

# GPA Page Modularization Refactor Plan

## Priority P0

### 1) Extract URL filter hook
- Scope: move `roster`/`subjectInput` URL parsing, normalization, and query-param sync from `src/pages/gpa/GpaPage.tsx` into a focused hook.
- Why high-signal: currently core state mechanics are interleaved with rendering, increasing cognitive load.
- Target outcome: page consumes a clean API like `{ roster, subjectInput, setRoster, setSubjectInput }`.

### 2) Extract roster-scoped storage hook
- Scope: move selected-course localStorage hydration/persist logic, parse/validation guards, and restore-toast gating to a dedicated hook.
- Why high-signal: lifecycle timing and persistence concerns are non-trivial and easier to validate in isolation.
- Target outcome: page no longer coordinates storage race guards directly.

### 3) Extract filters UI component
- Scope: move roster and subject combobox rendering/interaction from `GpaPage` to a reusable feature component.
- Why high-signal: filter UI is now large and dominates the route component.
- Target outcome: route file returns to composition-level responsibility.

## Priority P1

### 4) DRY combobox status rendering
- Scope: loading/error/retry/empty states shared between roster and subject dropdowns.
- Why: avoid duplicated state UX branches and message drift.

### 5) Extract command-row layout helpers
- Scope: code-column width calculation + responsive wrapped-label class patterns used by command list rows.
- Why: alignment and overflow behavior are now a shared UI contract and should be tuned centrally.

## Priority P2

### 6) Course mutation reducer/hook (conditional)
- Scope: `addCourse`, `removeCourse`, `updateCourseCredits`, `updateCourseGrade`.
- Why: useful only if transitions/invariants keep increasing in complexity.

### 7) Add tests for pure helpers
- Scope: parser/validation helpers, normalization functions, width calculation.
- Why: protects behavior while refactoring and future UI iteration.

## Non-goals
- No product behavior changes.
- No direct edits to `src/components/ui/*`.
- Keep existing Netlify proxy and query key strategy intact.
