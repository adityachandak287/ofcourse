import { queryOptions, useQuery } from "@tanstack/react-query"

import {
  fetchCornellClassesByRosterAndSubject,
  fetchCornellRosters,
  fetchCornellSubjectsByRoster,
  type CornellRoster,
  type CornellSubject,
} from "@/lib/api/cornellRosterClient"

export function cornellRostersQueryOptions() {
  return queryOptions({
    queryKey: ["cornellRoster", "rosters"] as const,
    queryFn: ({ signal }) => fetchCornellRosters({ signal }),
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useCornellRostersQuery(input?: { enabled?: boolean }) {
  return useQuery({
    ...cornellRostersQueryOptions(),
    enabled: input?.enabled ?? true,
  })
}

export function cornellSubjectsByRosterQueryOptions(input: { roster: CornellRoster }) {
  return queryOptions({
    queryKey: ["cornellRoster", "subjects", input.roster] as const,
    queryFn: ({ signal }) =>
      fetchCornellSubjectsByRoster({
        roster: input.roster,
        signal,
      }),
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useCornellSubjectsByRosterQuery(input: {
  roster: CornellRoster
  enabled?: boolean
}) {
  return useQuery({
    ...cornellSubjectsByRosterQueryOptions({
      roster: input.roster,
    }),
    enabled: input.enabled ?? true,
  })
}

export function cornellClassesByRosterAndSubjectQueryOptions(input: {
  roster: CornellRoster
  subject: CornellSubject
}) {
  return queryOptions({
    queryKey: ["cornellRoster", "classes", input.roster, input.subject] as const,
    queryFn: ({ signal }) =>
      fetchCornellClassesByRosterAndSubject({
        roster: input.roster,
        subject: input.subject,
        signal,
      }),
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useCornellClassesByRosterAndSubjectQuery(input: {
  roster: CornellRoster
  subject: CornellSubject
  enabled?: boolean
}) {
  return useQuery({
    ...cornellClassesByRosterAndSubjectQueryOptions({
      roster: input.roster,
      subject: input.subject,
    }),
    enabled: input.enabled ?? true,
  })
}
