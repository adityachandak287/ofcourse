import { describe, expect, it } from "vitest"

import { computeCornellGpa } from "@/lib/gpa/computeGpa"

describe("computeCornellGpa", () => {
  it("returns null GPA when there are no graded credits", () => {
    expect(computeCornellGpa([])).toEqual({
      gpa: null,
      gradedCredits: 0,
      qualityPoints: 0,
    })
  })

  it("excludes S/U from GPA and credits", () => {
    expect(
      computeCornellGpa([
        { credits: 3, grade: "A" },
        { credits: 3, grade: "S" },
      ]),
    ).toEqual({
      gpa: 4,
      gradedCredits: 3,
      qualityPoints: 12,
    })
  })

  it("computes a weighted average across letter grades", () => {
    // (3 * 4.0 + 1 * 3.0) / 4 = 15 / 4 = 3.75
    expect(
      computeCornellGpa([
        { credits: 3, grade: "A" },
        { credits: 1, grade: "B" },
      ]).gpa,
    ).toBeCloseTo(3.75)
  })

  it("skips non-positive or non-finite credits", () => {
    expect(
      computeCornellGpa([
        { credits: 0, grade: "A" },
        { credits: -1, grade: "A" },
        { credits: Number.NaN, grade: "A" },
        { credits: 3, grade: "A" },
      ]),
    ).toEqual({
      gpa: 4,
      gradedCredits: 3,
      qualityPoints: 12,
    })
  })
})
