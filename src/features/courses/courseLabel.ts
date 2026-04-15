import type { CornellClassSummary } from "@/lib/api/cornellRosterApiTypes"

export function formatCornellCourseLabel(course: CornellClassSummary): string {
  const subject = course.subject ?? "—"
  const catalogNbr = course.catalogNbr ?? "—"
  const title = course.titleShort ?? course.titleLong ?? "Untitled"
  return `${subject} ${catalogNbr} — ${title}`
}

export function getCornellCourseCredits(course: CornellClassSummary): number | null {
  const group = course.enrollGroups?.[0]
  const min = group?.unitsMinimum
  const max = group?.unitsMaximum

  if (typeof min === "number" && Number.isFinite(min) && min > 0) return min
  if (typeof max === "number" && Number.isFinite(max) && max > 0) return max
  return null
}
