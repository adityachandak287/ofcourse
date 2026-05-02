import { LETTER_GRADE_POINTS, gradeCountsTowardGpa, type CourseGrade } from "@/lib/gpa/grades"

export type GpaCourseInput = {
  credits: number
  grade: CourseGrade
}

export type GpaComputation = {
  gpa: number | null
  gradedCredits: number
  qualityPoints: number
}

export function computeCornellGpa(courses: readonly GpaCourseInput[]): GpaComputation {
  let gradedCredits = 0
  let qualityPoints = 0

  for (const course of courses) {
    if (!Number.isFinite(course.credits) || course.credits <= 0) continue

    if (!gradeCountsTowardGpa(course.grade)) {
      continue
    }

    gradedCredits += course.credits
    qualityPoints += course.credits * LETTER_GRADE_POINTS[course.grade]
  }

  if (gradedCredits <= 0) {
    return { gpa: null, gradedCredits: 0, qualityPoints: 0 }
  }

  return {
    gpa: qualityPoints / gradedCredits,
    gradedCredits,
    qualityPoints,
  }
}

