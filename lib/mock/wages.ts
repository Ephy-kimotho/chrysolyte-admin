import { getStaffSnapshot } from "@/lib/mock/staff"
import type { WageProjection } from "@/lib/types/wages"

type StoredWageEntry = Pick<
  WageProjection,
  | "id"
  | "projectId"
  | "staffId"
  | "weekStart"
  | "daysWorked"
  | "advance"
  | "status"
>

// In-memory stand-in for a wages API. Gross and net come from the staff
// member's daily rate, so they stay in step with Staff & KPI.
const wageEntries: StoredWageEntry[] = [
  {
    id: "kilimani-peter-2026-08-02",
    projectId: "kilimani-residence",
    staffId: "peter-mwangi",
    weekStart: "2026-08-02",
    daysWorked: 6,
    advance: 0,
    status: "Due Friday",
  },
  {
    id: "kilimani-james-2026-08-02",
    projectId: "kilimani-residence",
    staffId: "james-kamau",
    weekStart: "2026-08-02",
    daysWorked: 6,
    advance: 2_000,
    status: "Due Friday",
  },
]

export function getProjectWagesSnapshot(projectId: string): WageProjection[] {
  const staff = getStaffSnapshot()

  return wageEntries
    .filter((entry) => entry.projectId === projectId)
    .map((entry) => {
      const member = staff.find((item) => item.id === entry.staffId)
      const dailyRate = member?.dailyRate ?? 0
      const gross = entry.daysWorked * dailyRate
      return {
        ...entry,
        workerName: member?.fullName ?? "Former staff member",
        dailyRate,
        gross,
        net: gross - entry.advance,
      }
    })
}

export async function listProjectWages(projectId: string) {
  return getProjectWagesSnapshot(projectId)
}

/** Net wages still due this Friday for a project. */
export function getWeeklyWagesDue(projectId: string) {
  return getProjectWagesSnapshot(projectId)
    .filter((entry) => entry.status === "Due Friday")
    .reduce((total, entry) => total + entry.net, 0)
}
