export type LetterGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D+"
  | "D"
  | "D-"
  | "F"

export type SuGrade = "S" | "U"

export type CourseGrade = LetterGrade | SuGrade

export const LETTER_GRADE_POINTS: Record<LetterGrade, number> = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
}

export const GRADE_OPTIONS: CourseGrade[] = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "S",
  "U",
]

export function gradeCountsTowardGpa(grade: CourseGrade): grade is LetterGrade {
  return grade !== "S" && grade !== "U"
}

