export type CornellApiStatus = "success" | "error";

export type CornellApiSuccess<TData> = {
  status: "success";
  data: TData;
  message?: null;
  meta?: unknown;
};

export type CornellApiError = {
  status: "error";
  data: null;
  message: string;
  meta?: unknown;
};

export type CornellApiResponse<TData> =
  | CornellApiSuccess<TData>
  | CornellApiError;

export type CornellRosterCode = string;
export type CornellSubjectCode = string;

export type CornellRosterSummary = {
  slug: CornellRosterCode;
  descr: string;
  descrshort?: string;
  isDefaultRoster: "Y" | "N";
};

export type CornellSubjectSummary = {
  value: CornellSubjectCode;
  descr: string;
  descrformal: string;
};

export type CornellClassEnrollGroup = {
  unitsMinimum?: number;
  unitsMaximum?: number;
};

export type CornellClassSummary = {
  crseId?: number;
  crseOfferNbr?: number;
  subject?: CornellSubjectCode;
  catalogNbr?: string;
  titleShort?: string;
  titleLong?: string;
  enrollGroups?: CornellClassEnrollGroup[];
};

export type CornellRosterListData = {
  rosters: CornellRosterSummary[];
};

export type CornellSubjectListData = {
  subjects: CornellSubjectSummary[];
};

export type CornellClassSearchData = {
  classes: CornellClassSummary[];
};

export type CornellRosterListResponse =
  CornellApiResponse<CornellRosterListData>;
export type CornellSubjectListResponse =
  CornellApiResponse<CornellSubjectListData>;
export type CornellClassSearchResponse =
  CornellApiResponse<CornellClassSearchData>;
