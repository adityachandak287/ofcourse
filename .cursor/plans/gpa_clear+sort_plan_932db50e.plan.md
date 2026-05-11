---
name: GPA Clear+Sort Plan
overview: Implement roster-scoped clear-all anchored below the course table, and move sorting to clickable table headers with 3-state cycling and per-roster persisted preference.
todos:
  - id: add-sort-state
    content: Keep per-roster sort state model and localStorage load/save in GpaPage
    status: completed
  - id: derive-display-courses
    content: Implement memoized displayCourses with none/course/credits/grade comparators, 3-state column cycling, and S/U-last ranking
    status: completed
  - id: make-headers-sortable
    content: Make Course, Credits, and Grade headers clickable in SelectedCoursesTable and propagate sort toggles to GpaPage
    status: completed
  - id: add-clear-all-popover
    content: Place Clear all Popover control below the table and above summary, then wire clear handler
    status: completed
  - id: wire-table-and-validate
    content: Pass sort metadata and handlers between GpaPage and SelectedCoursesTable, then verify behavior contracts
    status: completed
isProject: false
---

# Plan: Clear-All + Sorting for Selected Courses

## Scope
Implement two UI/behavior changes on the GPA page:
1. Add **Clear all courses** for the active roster, confirmed via **shadcn Popover**.
2. Add **header-driven sorting** for selected courses (`Course`, `Credits`, `Grade`) with:
   - default = insertion order (no active sort)
   - click cycle per header: `asc` -> `desc` -> `none`
   - `S/U` ranked last for grade sort
   - sort preference persisted per roster in localStorage

## Files to Update
- [`src/pages/gpa/GpaPage.tsx`](src/pages/gpa/GpaPage.tsx)
- [`src/features/gpa/components/SelectedCoursesTable.tsx`](src/features/gpa/components/SelectedCoursesTable.tsx)

## Implementation Steps
- Add a roster-scoped sort preference model in `GpaPage`:
  - sort field: `none | course | credits | grade` (`none` means insertion order)
  - direction: `asc | desc`
  - storage key aligned with existing per-roster localStorage strategy.
- Load/sync sort preference whenever roster changes:
  - fallback to `none` + `asc` to preserve insertion-order default.
- Create memoized `displayCourses` derived from `selectedCourses`:
  - `none` returns source order unchanged.
  - `course` compares normalized course code strings.
  - `credits` compares numeric `credits`.
  - `grade` compares rank map with `S/U` explicitly last.
  - use stable tie-breaker (original index) to avoid jitter on equal values.
- Replace external sort controls with sortable table headers in `SelectedCoursesTable`:
  - `Course`, `Credits`, `Grade` headers become clickable buttons/triggers
  - each header click cycles its own state as `asc` -> `desc` -> `none`
  - clicking a different header activates that header in `asc` state
  - propagate sort-change events to `GpaPage` (single source of truth for persisted sort state)
- Add “Clear all” action in `GpaPage` using shadcn Popover confirmation:
  - trigger button disabled when no selected courses
  - confirmation text includes roster and course count
  - confirm action sets `selectedCourses` to empty
  - place control directly **below the course table** and **above quality-points summary**
  - optional toast on success for feedback.
- Pass `displayCourses`, sort metadata, and sort-toggle callback to `SelectedCoursesTable`.
- Keep row update/remove handlers key-based so edits/removals remain correct under sorting.

## Behavior Contracts
- Clearing only affects the active roster’s selected courses.
- Other roster course selections remain untouched.
- Sort preference is isolated per roster and restored on reload.
- Insertion order remains default until the user changes sort.
- Header sort cycle behavior is identical for `Course`, `Credits`, and `Grade`: `asc` -> `desc` -> `none`.
- Grade sort always places `S` and `U` after letter grades.

## Validation Checklist
- Clear-all button disabled at zero rows.
- Popover confirm appears and cancel does not mutate state.
- Confirm clear empties table and updates GPA summary values.
- Clear-all control renders below table and above summary text.
- Reload preserves cleared state for that roster.
- Clicking each sortable header cycles `asc` -> `desc` -> `none`.
- Switching from one header to another starts the new header at `asc`.
- Grade sorting keeps `S/U` at the bottom.
- Switching roster loads that roster’s saved sort + courses independently.

## Proposed commit message
`feat(gpa): add roster-scoped clear-all confirmation and persisted course sorting`

Implements low-friction course reset and stable sort controls while preserving per-roster state boundaries in localStorage.