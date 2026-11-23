import { isValid, parseISO } from "date-fns"

import { axiosInstance } from "@/lib/axios"
import type {
  CeoDashboard,
  CeoDashboardResponse,
  InactiveStaffMember,
  InactiveStaffResponse,
} from "@/lib/types/dashboard"

function toIsoDateTime(timestamp: string | null) {
  if (!timestamp) return null
  const date = parseISO(timestamp)
  return isValid(date) ? date.toISOString() : timestamp
}

function toInactiveStaffMember(
  member: InactiveStaffResponse
): InactiveStaffMember {
  return {
    id: member.staff_id,
    name: member.name,
    division: member.division,
    role: member.role,
    lastSeen: toIsoDateTime(member.last_seen),
    daysInactive: member.days_inactive,
  }
}

/**
 * Never active first, since they're the likeliest to need following up, then
 * the longest inactive, then by name.
 */
function compareInactiveStaff(a: InactiveStaffMember, b: InactiveStaffMember) {
  const daysA = a.daysInactive ?? Number.POSITIVE_INFINITY
  const daysB = b.daysInactive ?? Number.POSITIVE_INFINITY
  if (daysA !== daysB) return daysB - daysA
  return a.name.localeCompare(b.name)
}

/** What needs the CEO's attention across programme, cash, stock, people and risk. */
export async function getCeoDashboard(): Promise<CeoDashboard> {
  const response = await axiosInstance.get<CeoDashboardResponse>(
    "/firmcontrol/dashboard"
  )
  const { programme, cash, resources, people, risk } = response.data

  return {
    lateMilestones: programme?.late_milestones?.length ?? 0,
    overdueInstructions: programme?.overdue_instructions?.length ?? 0,
    overdueInvoices: cash?.overdue_invoices?.length ?? 0,
    unpaidWages: cash?.unpaid_wages?.length ?? 0,
    lowStockItems: resources?.low_stock?.length ?? 0,
    openIncidents: risk?.open_incidents?.length ?? 0,
    openInstructions: risk?.open_instructions_count ?? 0,
    inactiveStaff: (people?.inactive_staff ?? [])
      .map(toInactiveStaffMember)
      .sort(compareInactiveStaff),
  }
}
