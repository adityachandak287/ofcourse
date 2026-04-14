import type { CornellRosterSearchClassesResponse } from "@/lib/api/cornellRosterTypes"

export type CornellRoster = string
export type CornellSubject = string

export async function fetchCornellClassesByRosterAndSubject(input: {
  roster: CornellRoster
  subject: CornellSubject
  signal?: AbortSignal
}): Promise<CornellRosterSearchClassesResponse> {
  const { roster, subject, signal } = input

  const url = new URL("/api/search/classes.json", window.location.origin)
  url.searchParams.set("roster", roster)
  url.searchParams.set("subject", subject)

  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Cornell roster API failed: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CornellRosterSearchClassesResponse
}

