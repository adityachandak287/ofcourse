import type {
  CornellApiResponse,
  CornellClassSearchData,
  CornellRosterCode,
  CornellRosterListData,
  CornellSubjectCode,
  CornellSubjectListData,
} from "@/lib/api/cornellRosterApiTypes";

export type CornellRoster = CornellRosterCode;
export type CornellSubject = CornellSubjectCode;

async function fetchCornellApi<TData>(input: {
  path: string;
  query?: Record<string, string>;
  signal?: AbortSignal;
}): Promise<TData> {
  const url = new URL(input.path, window.location.origin);
  if (input.query) {
    Object.entries(input.query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url, { signal: input.signal });
  if (!res.ok) {
    throw new Error(
      `Cornell roster API failed: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as CornellApiResponse<TData>;
  if (data.status === "error") {
    throw new Error(data.message);
  }

  return data.data;
}

export async function fetchCornellRosters(input?: {
  signal?: AbortSignal;
}): Promise<CornellRosterListData> {
  return fetchCornellApi({
    path: "/api/config/rosters.json",
    signal: input?.signal,
  });
}

export async function fetchCornellSubjectsByRoster(input: {
  roster: CornellRoster;
  signal?: AbortSignal;
}): Promise<CornellSubjectListData> {
  return fetchCornellApi({
    path: "/api/config/subjects.json",
    query: { roster: input.roster },
    signal: input.signal,
  });
}

export async function fetchCornellClassesByRosterAndSubject(input: {
  roster: CornellRoster;
  subject: CornellSubject;
  signal?: AbortSignal;
}): Promise<CornellClassSearchData> {
  return fetchCornellApi({
    path: "/api/search/classes.json",
    query: { roster: input.roster, subject: input.subject },
    signal: input.signal,
  });
}
