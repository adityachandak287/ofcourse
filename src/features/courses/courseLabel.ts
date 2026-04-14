import type { CornellRosterClass } from "@/lib/api/cornellRosterTypes"

export function formatCornellCourseLabel(course: CornellRosterClass): string {
  const subject = course.subject ?? "—"
  const catalogNbr = course.catalogNbr ?? "—"
  const title = course.titleShort ?? course.titleLong ?? "Untitled"
  return `${subject} ${catalogNbr} — ${title}`
}

export function getCornellCourseCredits(course: CornellRosterClass): number | null {
  const group = course.enrollGroups?.[0]
  const min = group?.unitsMinimum
  const max = group?.unitsMaximum

  if (typeof min === "number" && Number.isFinite(min) && min > 0) return min
  if (typeof max === "number" && Number.isFinite(max) && max > 0) return max
  return null
}

