import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import type { CornellClassSummary } from "@/lib/api/cornellRosterApiTypes"
import { useCornellClassesByRosterAndSubjectQuery } from "@/features/courses/queries"
import { formatCornellCourseLabel, getCornellCourseCredits } from "@/features/courses/courseLabel"
import {
  SelectedCoursesTable,
  type SelectedCourseRow,
} from "@/features/gpa/components/SelectedCoursesTable"
import { computeCornellGpa43, type GpaCourseInput } from "@/lib/gpa/computeGpa"
import { type CourseGrade } from "@/lib/gpa/grades"

const DEFAULT_ROSTER = "SP26"

function normalizeSubject(input: string) {
  return input.trim().toUpperCase().replaceAll(/\s+/g, "")
}

export function GpaPage() {
  const [roster, setRoster] = React.useState<string>(DEFAULT_ROSTER)
  const [subjectInput, setSubjectInput] = React.useState<string>("CS")
  const subject = normalizeSubject(subjectInput)

  const [coursePickerOpen, setCoursePickerOpen] = React.useState(false)
  const [courseSearch, setCourseSearch] = React.useState("")

  const [selectedCourses, setSelectedCourses] = React.useState<SelectedCourseRow[]>([])

  const classesQuery = useCornellClassesByRosterAndSubjectQuery({
    roster,
    subject,
    enabled: subject.length > 0,
  })

  const courses = React.useMemo(() => classesQuery.data?.classes ?? [], [classesQuery.data])

  const filteredCourses = React.useMemo(() => {
    const q = courseSearch.trim().toLowerCase()
    if (!q) return courses

    return courses.filter((c) => {
      const label = formatCornellCourseLabel(c).toLowerCase()
      return label.includes(q)
    })
  }, [courseSearch, courses])

  const gpa = React.useMemo(() => {
    const inputs: GpaCourseInput[] = selectedCourses.map((c) => ({
      credits: c.credits,
      grade: c.grade,
    }))
    return computeCornellGpa43(inputs)
  }, [selectedCourses])

  function addCourse(course: CornellClassSummary) {
    const key =
      (course.crseId && course.crseOfferNbr != null
        ? `${course.crseId}-${course.crseOfferNbr}`
        : formatCornellCourseLabel(course)) || crypto.randomUUID()

    if (selectedCourses.some((c) => c.key === key)) return

    const credits = getCornellCourseCredits(course) ?? 3
    setSelectedCourses((prev) => [
      ...prev,
      { key, course, credits, grade: "A" },
    ])
  }

  function removeCourse(key: string) {
    setSelectedCourses((prev) => prev.filter((c) => c.key !== key))
  }

  function updateCourseCredits(key: string, value: string) {
    if (!value) return
    const parsed = Number.parseFloat(value)
    if (!Number.isFinite(parsed) || parsed <= 0) return

    setSelectedCourses((prev) =>
      prev.map((course) => (course.key === key ? { ...course, credits: parsed } : course))
    )
  }

  function updateCourseGrade(key: string, grade: CourseGrade) {
    setSelectedCourses((prev) =>
      prev.map((course) => (course.key === key ? { ...course, grade } : course))
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Card>
        <CardHeader>
          <CardTitle>GPA Calculator</CardTitle>
          <CardDescription>
            Pick a roster + subject, then add courses and experiment with grades (Cornell 4.3 scale).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="roster">Roster</Label>
                <Input
                  id="roster"
                  value={roster}
                  onChange={(e) => setRoster(e.target.value.trim().toUpperCase())}
                  placeholder="SP26"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="CS"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Add course</Label>
              <Popover open={coursePickerOpen} onOpenChange={setCoursePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    disabled={!subject || classesQuery.isLoading}
                  >
                    {classesQuery.isLoading ? "Loading courses..." : "Search courses"}
                    <Badge variant="secondary">{courses.length}</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      value={courseSearch}
                      onValueChange={setCourseSearch}
                      placeholder="Type: 2110, intro, algorithms..."
                    />
                    <CommandList>
                      <CommandEmpty>No courses found.</CommandEmpty>
                      <CommandGroup heading={`${roster} · ${subject}`}>
                        {filteredCourses.slice(0, 200).map((c, idx) => {
                          const key =
                            (c.crseId && c.crseOfferNbr != null
                              ? `${c.crseId}-${c.crseOfferNbr}`
                              : `${formatCornellCourseLabel(c)}-${idx}`) || `${idx}`

                          return (
                            <CommandItem
                              key={key}
                              value={formatCornellCourseLabel(c)}
                              onSelect={() => {
                                addCourse(c)
                                setCoursePickerOpen(false)
                                setCourseSearch("")
                              }}
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <div className="truncate">{formatCornellCourseLabel(c)}</div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                  {getCornellCourseCredits(c) ?? "—"} cr
                                </div>
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {classesQuery.isError ? (
                <div className="text-sm text-destructive">
                  Failed to load courses. (Check roster/subject, and Netlify proxy on deploy.)
                </div>
              ) : null}
              <div className="text-xs text-muted-foreground">
                Fetches `search/classes.json?roster={roster}&subject={subject}` and caches results client-side.
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-sm font-medium">Your courses</div>
                <div className="text-sm text-muted-foreground">
                  GPA:{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {gpa.gpa == null ? "—" : gpa.gpa.toFixed(3)}
                  </span>
                </div>
              </div>

              {selectedCourses.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Add a course above to start calculating.
                </div>
              ) : (
                <SelectedCoursesTable
                  courses={selectedCourses}
                  onCreditsChange={updateCourseCredits}
                  onGradeChange={updateCourseGrade}
                  onRemove={removeCourse}
                />
              )}

              <div className="text-xs text-muted-foreground">
                Quality points: <span className="tabular-nums">{gpa.qualityPoints.toFixed(2)}</span> ·
                Graded credits: <span className="tabular-nums">{gpa.gradedCredits.toFixed(1)}</span> ·
                S/U excluded from GPA.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
