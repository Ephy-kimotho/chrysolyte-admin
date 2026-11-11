import type { z } from "zod"

import type { createStaffMemberSchema } from "@/lib/schemas/staff"

export const staffDivisions = ["Construction", "Design", "Office"] as const

export type StaffDivision = (typeof staffDivisions)[number]

export const staffHealthStatuses = ["Fit", "Restricted duty", "Unfit"] as const

export type StaffHealthStatus = (typeof staffHealthStatuses)[number]

/** KPI scores, each 0–100. */
export type KpiScores = {
  attendance: number
  quality: number
  timeliness: number
  teamwork: number
}

/** Staff with no activity for more than this many days count as inactive. */
export const inactiveAfterDays = 2

export type StaffMember = {
  id: string
  /** Staff number, e.g. `ID-001`. */
  staffNumber: string
  fullName: string
  /** Profile photo URL, or null to show initials. */
  photoUrl: string | null
  email: string
  phone: string
  division: StaffDivision
  role: string
  /** Daily rate in Kenyan shillings. */
  dailyRate: number
  /** Highest qualification or registration, e.g. `B.Arch; Registered Graduate`. */
  qualification: string
  competences: string[]
  /** Assigned project, or null when unassigned. */
  projectId: string | null
  health: StaffHealthStatus
  /** Null until the first KPI review. */
  kpi: KpiScores | null
  /** Average of the KPI scores, 0–100, or null when not yet rated. */
  kpiEfficiency: number | null
  /** ISO date (yyyy-MM-dd) of the last logged activity. */
  lastActiveOn: string
  /** Whole days since the last logged activity. */
  daysSinceActive: number
}

export type CreateStaffMemberFormValues = z.infer<
  typeof createStaffMemberSchema
>
