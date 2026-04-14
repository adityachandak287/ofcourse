import { queryOptions, useQuery } from "@tanstack/react-query"

import {
  fetchCornellClassesByRosterAndSubject,
  type CornellRoster,
  type CornellSubject,
} from "@/lib/api/cornellRosterClient"

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

