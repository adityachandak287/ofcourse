import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCornellCourseLabel } from "@/features/courses/courseLabel";
import { cn } from "@/lib/utils";
import type { CornellClassSummary } from "@/lib/api/cornellRosterApiTypes";
import { GRADE_OPTIONS, type CourseGrade } from "@/lib/gpa/grades";

export type SelectedCourseRow = {
  key: string;
  course: CornellClassSummary;
  credits: number;
  grade: CourseGrade;
};

export type SortField = "none" | "course" | "credits" | "grade";
export type SortableField = Exclude<SortField, "none">;
export type SortDirection = "asc" | "desc";

type SelectedCoursesTableProps = {
  courses: readonly SelectedCourseRow[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldClick: (field: SortableField) => void;
  onCreditsChange: (key: string, value: string) => void;
  onGradeChange: (key: string, grade: CourseGrade) => void;
  onRemove: (key: string) => void;
};

function getAriaSort(
  field: SortableField,
  activeField: SortField,
  direction: SortDirection,
): "ascending" | "descending" | "none" {
  if (activeField !== field) return "none";
  return direction === "asc" ? "ascending" : "descending";
}

function SortableHeaderButton({
  field,
  label,
  activeField,
  direction,
  align,
  onClick,
}: {
  field: SortableField;
  label: string;
  activeField: SortField;
  direction: SortDirection;
  align: "start" | "center";
  onClick: (field: SortableField) => void;
}) {
  const isActive = activeField === field;
  return (
    <button
      type="button"
      onClick={() => onClick(field)}
      className={cn(
        "inline-flex w-full cursor-pointer items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        align === "center" ? "justify-center" : "justify-start",
        isActive ? "text-foreground" : "",
      )}
    >
      <span>{label}</span>
      {isActive ? (
        direction === "asc" ? (
          <ArrowUpIcon className="size-3" aria-hidden />
        ) : (
          <ArrowDownIcon className="size-3" aria-hidden />
        )
      ) : null}
    </button>
  );
}

export function SelectedCoursesTable({
  courses,
  sortField,
  sortDirection,
  onSortFieldClick,
  onCreditsChange,
  onGradeChange,
  onRemove,
}: SelectedCoursesTableProps) {
  return (
    <Table className="table-fixed text-xs sm:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead
            className="p-1.5"
            aria-sort={getAriaSort("course", sortField, sortDirection)}
          >
            <SortableHeaderButton
              field="course"
              label="Course"
              activeField={sortField}
              direction={sortDirection}
              align="start"
              onClick={onSortFieldClick}
            />
          </TableHead>
          <TableHead
            className="w-18 p-1.5 text-center"
            aria-sort={getAriaSort("credits", sortField, sortDirection)}
          >
            <SortableHeaderButton
              field="credits"
              label="Credits"
              activeField={sortField}
              direction={sortDirection}
              align="center"
              onClick={onSortFieldClick}
            />
          </TableHead>
          <TableHead
            className="w-16 p-1.5 text-center"
            aria-sort={getAriaSort("grade", sortField, sortDirection)}
          >
            <SortableHeaderButton
              field="grade"
              label="Grade"
              activeField={sortField}
              direction={sortDirection}
              align="center"
              onClick={onSortFieldClick}
            />
          </TableHead>
          <TableHead className="w-10 p-1.5 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.key}>
            <TableCell className="min-w-0 p-1.5 align-top">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="text-xs leading-snug font-medium whitespace-normal wrap-break-word sm:text-sm">
                  {formatCornellCourseLabel(course.course)}
                </div>
                {!course.course.enrollGroups?.length ? (
                  <div className="text-xs text-muted-foreground">
                    (defaulted)
                  </div>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="w-16 p-1.5 align-middle">
              <Input
                type="number"
                inputMode="decimal"
                min={0.5}
                step={0.5}
                value={String(course.credits)}
                onChange={(event) =>
                  onCreditsChange(course.key, event.target.value)
                }
                className="h-8 px-1 text-center text-sm"
                aria-label="Override credits"
              />
            </TableCell>
            <TableCell className="w-16 p-1.5 align-middle">
              <Select
                value={course.grade}
                onValueChange={(value) =>
                  onGradeChange(course.key, value as CourseGrade)
                }
              >
                <SelectTrigger className="h-8 w-full min-w-0 px-1.5 text-sm">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="w-10 p-1.5 text-right align-middle">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(course.key)}
                aria-label="Remove course"
              >
                <Trash2Icon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
