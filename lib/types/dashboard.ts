/** A staff member with no recent activity, from `GET /firmcontrol/dashboard`. */
export type InactiveStaffResponse = {
  staff_id: string
  name: string
  division: string
  role: string
  /** When they were last active, or null if they never have been. */
  last_seen: string | null
  days_inactive: number | null
}

/**
 * `GET /firmcontrol/dashboard`. Only the inactive staff items have a known
 * shape so far, so the other lists are only counted.
 */
export type CeoDashboardResponse = {
  programme?: {
    late_milestones?: unknown[]
    overdue_instructions?: unknown[]
  }
  cash?: {
    overdue_invoices?: unknown[]
    unpaid_wages?: unknown[]
  }
  resources?: {
    low_stock?: unknown[]
  }
  people?: {
    inactive_staff?: InactiveStaffResponse[]
  }
  risk?: {
    open_incidents?: unknown[]
    open_instructions_count?: number
  }
}

export type InactiveStaffMember = {
  id: string
  name: string
  division: string
  role: string
  /** ISO date and time, or null if they've never been active. */
  lastSeen: string | null
  daysInactive: number | null
}

export type CeoDashboard = {
  lateMilestones: number
  overdueInstructions: number
  overdueInvoices: number
  unpaidWages: number
  lowStockItems: number
  openIncidents: number
  openInstructions: number
  inactiveStaff: InactiveStaffMember[]
}
