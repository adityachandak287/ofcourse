---
name: GPA Clear+Sort Plan
overview: Implement roster-scoped clear-all with shadcn Popover confirmation, and add user-controlled sorting for selected courses with per-roster persisted sort preferences.
todos:
  - id: add-sort-state
    content: Add per-roster sort state model and localStorage load/save in GpaPage
    status: pending
  - id: derive-display-courses
    content: Implement memoized displayCourses with none/course/credits/grade comparators and S/U-last ranking
    status: pending
  - id: add-sort-ui
    content: Add sort field + direction controls in GPA page and wire to state
    status: pending
  - id: add-clear-all-popover
    content: Add Clear all trigger with shadcn Popover confirmation and clear handler
    status: pending
  - id: wire-table-and-validate
    content: Pass displayCourses to SelectedCoursesTable and verify behavior contracts
    status: pending
isProject: false
---

# Plan: Clear-All + Sorting for Selected Courses

## Scope
Implement two UI/behavior changes on the GPA page:
1. Add **Clear all courses** for the active roster, confirmed via **shadcn Popover**.
2. Add **sorting controls** for selected courses (course code, credits, grade) with:
   - default = insertion order (no active sort)
   - `S/U` ranked last for grade sort
   - sort preference persisted per roster in localStorage

## Files to Update
- [`/Users/aditya/projects/personal/ofcourse/src/pages/gpa/GpaPage.tsx`](/Users/aditya/projects/personal/ofcourse/src/pages/gpa/GpaPage.tsx)
- [`/Users/aditya/projects/personal/ofcourse/src/features/gpa/components/SelectedCoursesTable.tsx`](/Users/aditya/projects/personal/ofcourse/src/features/gpa/components/SelectedCoursesTable.tsx)

## Implementation Steps
- Add a roster-scoped sort preference model in `GpaPage`:
  - sort field: `none | course | credits | grade`
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
- Add sorting controls near the “Your courses” section in `GpaPage`:
  - sort field selector
  - direction toggle
  - wire controls to update persisted per-roster preference.
- Add “Clear all” action in `GpaPage` using shadcn Popover confirmation:
  - trigger button disabled when no selected courses
  - confirmation text includes roster and course count
  - confirm action sets `selectedCourses` to empty
  - optional toast on success for feedback.
- Pass `displayCourses` to `SelectedCoursesTable` (keep row handlers key-based).
- Keep `SelectedCoursesTable` presentational; only minimal prop or copy updates if needed.

## Behavior Contracts
- Clearing only affects the active roster’s selected courses.
- Other roster course selections remain untouched.
- Sort preference is isolated per roster and restored on reload.
- Insertion order remains default until the user changes sort.
- Grade sort always places `S` and `U` after letter grades.

## Validation Checklist
- Clear-all button disabled at zero rows.
- Popover confirm appears and cancel does not mutate state.
- Confirm clear empties table and updates GPA summary values.
- Reload preserves cleared state for that roster.
- Course/credits/grade sorting works both directions.
- Grade sorting keeps `S/U` at the bottom.
- Switching roster loads that roster’s saved sort + courses independently.

## Proposed commit message
`feat(gpa): add roster-scoped clear-all confirmation and persisted course sorting`

Implements low-friction course reset and stable sort controls while preserving per-roster state boundaries in localStorage.