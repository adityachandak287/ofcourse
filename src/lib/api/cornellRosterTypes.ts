export type CornellRosterSearchClassesResponse = {
  status: string
  data: {
    classes: CornellRosterClass[]
  }
}

export type CornellRosterClass = {
  crseId?: string
  crseOfferNbr?: number
  subject?: string
  catalogNbr?: string
  titleShort?: string
  titleLong?: string
  // Credits are nested in the roster API; we’ll extract a display value later.
  enrollGroups?: CornellRosterEnrollGroup[]
}

export type CornellRosterEnrollGroup = {
  unitsMinimum?: number
  unitsMaximum?: number
}

