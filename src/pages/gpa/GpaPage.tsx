import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useSearchParams } from "wouter";

import type { CornellClassSummary } from "@/lib/api/cornellRosterApiTypes";
import {
  useCornellClassesByRosterAndSubjectQuery,
  useCornellRostersQuery,
  useCornellSubjectsByRosterQuery,
} from "@/features/courses/queries";
import {
  formatCornellCourseLabel,
  getCornellCourseCredits,
} from "@/features/courses/courseLabel";
import {
  SelectedCoursesTable,
  type SelectedCourseRow,
} from "@/features/gpa/components/SelectedCoursesTable";
import { computeCornellGpa, type GpaCourseInput } from "@/lib/gpa/computeGpa";
import { GRADE_OPTIONS, type CourseGrade } from "@/lib/gpa/grades";

const DEFAULT_ROSTER = "SP26";
const DEFAULT_SUBJECT = "CS";
const SELECTED_COURSES_STORAGE_PREFIX = "ofcourse-selected-courses";

type StoredSelectedCourseRow = {
  key: string;
  course: CornellClassSummary;
  credits: number;
  grade: CourseGrade;
};

function getSelectedCoursesStorageKey(roster: string) {
  return `${SELECTED_COURSES_STORAGE_PREFIX}:${roster}`;
}

function getColumnWidthCh(input: {
  maxCodeLength: number;
  minCh: number;
  maxCh: number;
  paddingCh?: number;
}) {
  const paddedLength = input.maxCodeLength + (input.paddingCh ?? 1);
  const widthCh = Math.min(input.maxCh, Math.max(input.minCh, paddedLength));
  return `${widthCh}ch`;
}

function normalizeRoster(input: string) {
  return input.trim().toUpperCase();
}

function isCourseGrade(value: unknown): value is CourseGrade {
  return (
    typeof value === "string" && GRADE_OPTIONS.includes(value as CourseGrade)
  );
}

function isCornellClassSummary(value: unknown): value is CornellClassSummary {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const maybeCourse = value as Record<string, unknown>;

  if (
    maybeCourse.crseId !== undefined &&
    typeof maybeCourse.crseId !== "number"
  )
    return false;
  if (
    maybeCourse.crseOfferNbr !== undefined &&
    typeof maybeCourse.crseOfferNbr !== "number"
  )
    return false;
  if (
    maybeCourse.subject !== undefined &&
    typeof maybeCourse.subject !== "string"
  )
    return false;
  if (
    maybeCourse.catalogNbr !== undefined &&
    typeof maybeCourse.catalogNbr !== "string"
  )
    return false;
  if (
    maybeCourse.titleShort !== undefined &&
    typeof maybeCourse.titleShort !== "string"
  )
    return false;
  if (
    maybeCourse.titleLong !== undefined &&
    typeof maybeCourse.titleLong !== "string"
  )
    return false;

  if (maybeCourse.enrollGroups !== undefined) {
    if (!Array.isArray(maybeCourse.enrollGroups)) return false;
    for (const enrollGroup of maybeCourse.enrollGroups) {
      if (
        !enrollGroup ||
        typeof enrollGroup !== "object" ||
        Array.isArray(enrollGroup)
      )
        return false;
      const maybeEnrollGroup = enrollGroup as Record<string, unknown>;
      if (
        maybeEnrollGroup.unitsMinimum !== undefined &&
        typeof maybeEnrollGroup.unitsMinimum !== "number"
      ) {
        return false;
      }
      if (
        maybeEnrollGroup.unitsMaximum !== undefined &&
        typeof maybeEnrollGroup.unitsMaximum !== "number"
      ) {
        return false;
      }
    }
  }

  return true;
}

function parseStoredSelectedCourses(
  value: string | null,
): SelectedCourseRow[] | null {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;

    const nextCourses: SelectedCourseRow[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const maybeRow = item as Record<string, unknown>;
      const candidate: StoredSelectedCourseRow = {
        key: maybeRow.key as string,
        course: maybeRow.course as CornellClassSummary,
        credits: maybeRow.credits as number,
        grade: maybeRow.grade as CourseGrade,
      };

      if (typeof candidate.key !== "string") return null;
      if (!isCornellClassSummary(candidate.course)) return null;
      if (
        typeof candidate.credits !== "number" ||
        !Number.isFinite(candidate.credits) ||
        candidate.credits <= 0
      ) {
        return null;
      }
      if (!isCourseGrade(candidate.grade)) return null;

      nextCourses.push(candidate);
    }

    return nextCourses;
  } catch {
    return null;
  }
}

function normalizeSubject(input: string) {
  return input.trim().toUpperCase().replaceAll(/\s+/g, "");
}

function getCourseFiltersFromSearchParams(params: URLSearchParams) {
  const rosterFromParams = normalizeRoster(params.get("roster") ?? "");
  const subjectFromParams = normalizeSubject(params.get("subject") ?? "");

  return {
    roster: rosterFromParams || DEFAULT_ROSTER,
    subjectInput: subjectFromParams || DEFAULT_SUBJECT,
  };
}

export function GpaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseFilters = React.useMemo(
    () => getCourseFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const [roster, setRoster] = React.useState<string>(
    initialCourseFilters.roster,
  );
  const [subjectInput, setSubjectInput] = React.useState<string>(
    initialCourseFilters.subjectInput,
  );
  const subject = normalizeSubject(subjectInput);

  const [coursePickerOpen, setCoursePickerOpen] = React.useState(false);
  const [courseSearch, setCourseSearch] = React.useState("");
  const [rosterPickerOpen, setRosterPickerOpen] = React.useState(false);
  const [rosterSearch, setRosterSearch] = React.useState("");
  const [subjectPickerOpen, setSubjectPickerOpen] = React.useState(false);
  const [subjectSearch, setSubjectSearch] = React.useState("");
  const [hasRequestedRosters, setHasRequestedRosters] = React.useState(false);
  const [hasRequestedSubjectsByRoster, setHasRequestedSubjectsByRoster] =
    React.useState<Record<string, boolean>>({});

  const [selectedCourses, setSelectedCourses] = React.useState<
    SelectedCourseRow[]
  >([]);
  const [loadedRoster, setLoadedRoster] = React.useState<string | null>(null);
  const hasLoadedRosterRef = React.useRef<Record<string, boolean>>({});

  const classesQuery = useCornellClassesByRosterAndSubjectQuery({
    roster,
    subject,
    enabled: subject.length > 0,
  });

  const rostersQuery = useCornellRostersQuery({
    enabled: hasRequestedRosters,
  });

  const subjectsQuery = useCornellSubjectsByRosterQuery({
    roster,
    enabled: hasRequestedSubjectsByRoster[roster] === true,
  });

  const courses = React.useMemo(
    () => classesQuery.data?.classes ?? [],
    [classesQuery.data],
  );
  const rosters = React.useMemo(
    () =>
      [...(rostersQuery.data?.rosters ?? [])].sort((a, b) => {
        const aShort = a.descrshort ?? "";
        const bShort = b.descrshort ?? "";
        return bShort.localeCompare(aShort);
      }),
    [rostersQuery.data],
  );
  const subjects = React.useMemo(
    () => subjectsQuery.data?.subjects ?? [],
    [subjectsQuery.data],
  );

  const rosterCodeColumnWidth = React.useMemo(() => {
    const maxCodeLength = rosters.reduce(
      (max, option) => Math.max(max, option.slug.length),
      0,
    );
    return getColumnWidthCh({
      maxCodeLength,
      minCh: 6,
      maxCh: 10,
      paddingCh: 1,
    });
  }, [rosters]);

  const subjectCodeColumnWidth = React.useMemo(() => {
    const maxCodeLength = subjects.reduce(
      (max, option) => Math.max(max, option.value.length),
      0,
    );
    return getColumnWidthCh({
      maxCodeLength,
      minCh: 4,
      maxCh: 9,
      paddingCh: 1,
    });
  }, [subjects]);

  const courseCodeColumnWidth = React.useMemo(() => {
    const maxCodeLength = courses.reduce((max, option) => {
      const courseCode = `${option.subject ?? "—"} ${option.catalogNbr ?? "—"}`;
      return Math.max(max, courseCode.length);
    }, 0);

    return getColumnWidthCh({
      maxCodeLength,
      minCh: 8,
      maxCh: 14,
      paddingCh: 1,
    });
  }, [courses]);

  const filteredCourses = React.useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses;

    return courses.filter((c) => {
      const label = formatCornellCourseLabel(c).toLowerCase();
      return label.includes(q);
    });
  }, [courseSearch, courses]);

  const gpa = React.useMemo(() => {
    const inputs: GpaCourseInput[] = selectedCourses.map((c) => ({
      credits: c.credits,
      grade: c.grade,
    }));
    return computeCornellGpa(inputs);
  }, [selectedCourses]);

  React.useEffect(() => {
    const normalizedRoster = normalizeRoster(roster);
    const normalizedSubject = normalizeSubject(subjectInput);
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("roster", normalizedRoster);
    nextSearchParams.set("subject", normalizedSubject);

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [roster, searchParams, subjectInput, setSearchParams]);

  React.useEffect(() => {
    const nextFilters = getCourseFiltersFromSearchParams(searchParams);

    setRoster((prev) =>
      prev === nextFilters.roster ? prev : nextFilters.roster,
    );
    setSubjectInput((prev) =>
      prev === nextFilters.subjectInput ? prev : nextFilters.subjectInput,
    );
  }, [searchParams]);

  React.useEffect(() => {
    const storageKey = getSelectedCoursesStorageKey(roster);
    const parsedCourses = parseStoredSelectedCourses(
      localStorage.getItem(storageKey),
    );

    if (parsedCourses == null) {
      setSelectedCourses([]);
      setLoadedRoster(roster);
      return;
    }

    setSelectedCourses(parsedCourses);
    setLoadedRoster(roster);

    const isFirstLoadForRoster = !hasLoadedRosterRef.current[roster];
    hasLoadedRosterRef.current[roster] = true;

    if (isFirstLoadForRoster && parsedCourses.length > 0) {
      setTimeout(() => {
        toast.info("Loaded saved courses from this device.", {
          description: `Loaded ${parsedCourses.length} course${parsedCourses.length === 1 ? "" : "s"} for ${roster}.`,
        });
      }, 0);
    }
  }, [roster]);

  React.useEffect(() => {
    if (loadedRoster !== roster) return;

    const storageKey = getSelectedCoursesStorageKey(roster);
    localStorage.setItem(storageKey, JSON.stringify(selectedCourses));
  }, [loadedRoster, roster, selectedCourses]);

  function addCourse(course: CornellClassSummary) {
    const key =
      (course.crseId && course.crseOfferNbr != null
        ? `${course.crseId}-${course.crseOfferNbr}`
        : formatCornellCourseLabel(course)) || crypto.randomUUID();

    if (selectedCourses.some((c) => c.key === key)) return;

    const credits = getCornellCourseCredits(course) ?? 3;
    setSelectedCourses((prev) => [
      ...prev,
      { key, course, credits, grade: "A" },
    ]);
  }

  function removeCourse(key: string) {
    setSelectedCourses((prev) => prev.filter((c) => c.key !== key));
  }

  function updateCourseCredits(key: string, value: string) {
    if (!value) return;
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    setSelectedCourses((prev) =>
      prev.map((course) =>
        course.key === key ? { ...course, credits: parsed } : course,
      ),
    );
  }

  function updateCourseGrade(key: string, grade: CourseGrade) {
    setSelectedCourses((prev) =>
      prev.map((course) =>
        course.key === key ? { ...course, grade } : course,
      ),
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Card>
        <CardHeader>
          <CardTitle>GPA Calculator</CardTitle>
          <CardDescription>
            Pick a roster + subject, then add courses and experiment with grades
            (Cornell 4.3 scale).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Roster</Label>
                <Popover
                  open={rosterPickerOpen}
                  onOpenChange={(open) => {
                    setRosterPickerOpen(open);
                    if (open) setHasRequestedRosters(true);
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {roster || DEFAULT_ROSTER}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        value={rosterSearch}
                        onValueChange={setRosterSearch}
                        placeholder="Search roster..."
                      />
                      <CommandList>
                        {rostersQuery.isLoading ? (
                          <CommandGroup>
                            <CommandItem disabled value="loading-rosters">
                              Loading rosters...
                            </CommandItem>
                          </CommandGroup>
                        ) : null}

                        {rostersQuery.isError ? (
                          <CommandGroup>
                            <CommandItem disabled value="rosters-error">
                              Failed to load rosters.
                            </CommandItem>
                            <CommandItem
                              value="retry-rosters"
                              onSelect={() => {
                                void rostersQuery.refetch();
                              }}
                            >
                              Retry
                            </CommandItem>
                          </CommandGroup>
                        ) : null}

                        {!rostersQuery.isLoading && !rostersQuery.isError ? (
                          <>
                            <CommandEmpty>No rosters found.</CommandEmpty>
                            <CommandGroup heading="Rosters">
                              {rosters.map((option) => (
                                <CommandItem
                                  key={option.slug}
                                  value={`${option.slug} ${option.descr}`}
                                  onSelect={() => {
                                    setRoster(normalizeRoster(option.slug));
                                    setRosterPickerOpen(false);
                                    setRosterSearch("");
                                  }}
                                >
                                  <span
                                    className="shrink-0 font-medium tabular-nums"
                                    style={{ width: rosterCodeColumnWidth }}
                                  >
                                    {option.slug}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {option.descr}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        ) : null}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Subject</Label>
                <Popover
                  open={subjectPickerOpen}
                  onOpenChange={(open) => {
                    setSubjectPickerOpen(open);
                    if (!open) return;
                    setHasRequestedSubjectsByRoster((prev) => ({
                      ...prev,
                      [roster]: true,
                    }));
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {subject || DEFAULT_SUBJECT}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        value={subjectSearch}
                        onValueChange={setSubjectSearch}
                        placeholder="Search subject..."
                      />
                      <CommandList>
                        {subjectsQuery.isLoading ? (
                          <CommandGroup>
                            <CommandItem disabled value="loading-subjects">
                              Loading subjects...
                            </CommandItem>
                          </CommandGroup>
                        ) : null}

                        {subjectsQuery.isError ? (
                          <CommandGroup>
                            <CommandItem disabled value="subjects-error">
                              Failed to load subjects.
                            </CommandItem>
                            <CommandItem
                              value="retry-subjects"
                              onSelect={() => {
                                void subjectsQuery.refetch();
                              }}
                            >
                              Retry
                            </CommandItem>
                          </CommandGroup>
                        ) : null}

                        {!subjectsQuery.isLoading && !subjectsQuery.isError ? (
                          <>
                            <CommandEmpty>No subjects found.</CommandEmpty>
                            <CommandGroup heading={`Subjects for ${roster}`}>
                              {subjects.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={`${option.value} ${option.descrformal}`}
                                  className="items-start"
                                  onSelect={() => {
                                    setSubjectInput(
                                      normalizeSubject(option.value),
                                    );
                                    setSubjectPickerOpen(false);
                                    setSubjectSearch("");
                                  }}
                                >
                                  <span
                                    className="shrink-0 font-medium"
                                    style={{ width: subjectCodeColumnWidth }}
                                  >
                                    {option.value}
                                  </span>
                                  <span className="min-w-0 max-w-[12rem] break-words whitespace-normal text-muted-foreground leading-snug sm:max-w-[18rem]">
                                    {option.descrformal}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        ) : null}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Add course</Label>
              <Popover
                open={coursePickerOpen}
                onOpenChange={setCoursePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    disabled={!subject || classesQuery.isLoading}
                  >
                    {classesQuery.isLoading
                      ? "Loading courses..."
                      : "Search courses"}
                    <Badge variant="secondary">{courses.length}</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
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
                              : `${formatCornellCourseLabel(c)}-${idx}`) ||
                            `${idx}`;

                          return (
                            <CommandItem
                              key={key}
                              value={formatCornellCourseLabel(c)}
                              className="items-start"
                              onSelect={() => {
                                addCourse(c);
                                setCoursePickerOpen(false);
                                setCourseSearch("");
                              }}
                            >
                              <div className="flex min-w-0 w-full items-center gap-2 overflow-hidden">
                                <span
                                  className="shrink-0 whitespace-nowrap font-medium"
                                  style={{ width: courseCodeColumnWidth }}
                                >
                                  {`${c.subject ?? "—"} ${c.catalogNbr ?? "—"}`}
                                </span>
                                <div className="min-w-0 max-w-[12rem] flex-1 break-words whitespace-normal text-muted-foreground leading-snug sm:max-w-[18rem]">
                                  {c.titleLong ?? c.titleShort ?? "Untitled"}
                                </div>
                                <div className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                                  {getCornellCourseCredits(c) ?? "—"} cr
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {classesQuery.isError ? (
                <div className="text-sm text-destructive">
                  Failed to load courses. (Check roster/subject, and Netlify
                  proxy on deploy.)
                </div>
              ) : null}
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
                Quality points:{" "}
                <span className="tabular-nums">
                  {gpa.qualityPoints.toFixed(2)}
                </span>{" "}
                · Graded credits:{" "}
                <span className="tabular-nums">
                  {gpa.gradedCredits.toFixed(1)}
                </span>{" "}
                · S/U excluded from GPA.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
