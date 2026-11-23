/** `GET /firmcontrol/portal/me`: the signed-in client and their projects. */
export type PortalResponse = {
  client: {
    client_id: string
    name: string
    contact_name: string
    email: string
    phone: string
    active: boolean
    created_at: string
  }
  projects: PortalProjectResponse[]
}

export type PortalProjectResponse = {
  project_id: string
  name: string
  status: string
  /** ISO date, e.g. `2026-12-30`. */
  deadline: string
  photo_url: string | null
  /** Percentage complete, 0–100. Can have decimals, e.g. `52.5`. */
  progress: number
  /** In KES. 0 when it hasn't been set. */
  contract_value: number
  /** In KES. */
  collected: number
  /** In KES: the contract value less what's been collected. */
  balance: number
}

export type PortalClient = {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
}

export type PortalProject = {
  id: string
  name: string
  status: string
  /** ISO date. */
  deadline: string
  photoUrl: string | null
  progress: number
  contractValue: number
  collected: number
  balance: number
}

export type Portal = {
  client: PortalClient
  projects: PortalProject[]
}

/** `GET /firmcontrol/portal/projects/{project_id}`. */
export type PortalProjectDetailsResponse = {
  project: {
    project_id: string
    name: string
    /** The client's name. */
    client: string
    status: string
    /** ISO date. */
    deadline: string
    photo_url: string | null
    /** A note from Chrysolyte for the client. */
    client_note: string | null
  }
  /** Percentage complete, 0–100. */
  progress: number
  milestones: {
    name: string
    /** Share of the project, as a percentage. */
    weight: number
    progress: number
    /** ISO date. */
    deadline: string
  }[]
  // Item shape not confirmed yet, so they're only counted.
  approved_reports: unknown[]
  payments: {
    records: {
      /** ISO date. */
      transaction_date: string
      description: string
      /** In KES. */
      amount: number
    }[]
    total_collected: number
    /** 0 when it hasn't been set. */
    contract_value: number
    balance: number
  }
}

export type PortalMilestone = {
  name: string
  weight: number
  progress: number
  /** ISO date. */
  deadline: string
}

export type PortalPayment = {
  /** ISO date. */
  date: string
  description: string
  amount: number
}

export type PortalProjectDetails = {
  id: string
  name: string
  clientName: string
  status: string
  /** ISO date. */
  deadline: string
  photoUrl: string | null
  clientNote: string | null
  progress: number
  contractValue: number
  collected: number
  balance: number
  milestones: PortalMilestone[]
  approvedReportCount: number
  payments: PortalPayment[]
}
