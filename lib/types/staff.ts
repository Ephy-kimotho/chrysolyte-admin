import type { z } from "zod"

import type {
  assignProjectSchema,
  createEmergencyContactSchema,
  createStaffMemberSchema,
  createStaffSkillSchema,
  staffDetailsShape,
  updateStaffMemberSchema,
  uploadStaffPhotoSchema,
} from "@/lib/schemas/staff"

export const staffDivisions = ["Construction", "Design", "Office"] as const

export type StaffDivision = (typeof staffDivisions)[number]

export const staffHealthStatuses = ["Fit", "Restricted duty", "Unfit"] as const

export type StaffHealthStatus = (typeof staffHealthStatuses)[number]

// Sent to the API exactly as written here.
export const staffEmploymentTypes = ["Permanent", "Casual"] as const

export type StaffEmploymentType = (typeof staffEmploymentTypes)[number]

/** KPI scores, each 0–100. */
export type KpiScores = {
  attendance: number
  quality: number
  timeliness: number
  teamwork: number
}

/** Staff with no activity for more than this many days count as inactive. */
export const inactiveAfterDays = 2

/** Filters for `GET /people/staff`. */
export type StaffFilters = {
  division?: StaffDivision
  /** True lists active staff only. */
  activeOnly?: boolean
}

export type StaffMember = {
  id: string
  /** National ID or passport number. */
  idNo: string
  fullName: string
  /** Profile photo URL, or null to show initials. */
  photoUrl: string | null
  email: string
  phone: string
  /** One of `staffDivisions`, unless the API sends a division the app doesn't know. */
  division: string
  role: string
  /** As the API sends it, e.g. `Casual` or `Permanent`. */
  employmentType: string
  /** ISO date (yyyy-MM-dd). */
  startDate: string
  /** Daily rate in Kenyan shillings. */
  dailyRate: number
  /** One of `staffHealthStatuses`, unless the API sends one the app doesn't know. */
  health: string
  /** ISO date (yyyy-MM-dd), or null when none is on record. */
  returnToWork: string | null
  isActive: boolean
  /** Timestamp with offset, e.g. `2026-11-19 07:41:27.608949+00:00`. */
  createdAt: string

  // The staff API doesn't return the fields below yet, so they're always
  // null or empty for now. The UI shows each one's empty state.

  /** Assigned project, or null when unassigned. */
  projectId: string | null
  /** Null until the first KPI review. */
  kpi: KpiScores | null
  /** Average of the KPI scores, 0–100, or null when not yet rated. */
  kpiEfficiency: number | null
  /** ISO date (yyyy-MM-dd) of the last logged activity, or null when none is logged. */
  lastActiveOn: string | null
  /** Whole days since the last logged activity, or null when none is logged. */
  daysSinceActive: number | null
}

/** What the add-staff form holds while editing. */
export type CreateStaffMemberFormInput = z.input<typeof createStaffMemberSchema>

export type CreateStaffMemberFormValues = z.output<
  typeof createStaffMemberSchema
>

/** The details the add and update forms share, as the inputs hold them. */
export type StaffDetailsFormInput = z.input<typeof staffDetailsShape>

/** What the update form holds while editing. */
export type UpdateStaffMemberFormInput = z.input<typeof updateStaffMemberSchema>

export type UpdateStaffMemberFormValues = z.output<
  typeof updateStaffMemberSchema
>

/** Request body for `POST /people/staff`. */
export type CreateStaffMemberPayload = {
  name: string
  /** Lowercase, e.g. `construction`. */
  division: Lowercase<StaffDivision>
  role: string
  phone: string
  email: string
  /** National ID or passport number. */
  id_no: string
  employment_type: StaffEmploymentType
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  /** In Kenyan shillings. */
  daily_rate: number
  health_status: StaffHealthStatus
  /** ISO date (yyyy-MM-dd); only sent when the health status isn't Fit. */
  return_to_work?: string
}

/** A staff member as the API returns it. */
export type StaffMemberResponse = {
  staff_id: string
  name: string
  /** Casing varies, e.g. `Design`. */
  division: string
  role: string
  phone: string
  email: string
  id_no: string
  /** One of `staffEmploymentTypes`, though older records may differ. */
  employment_type: string
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  daily_rate: number
  /** Casing varies, e.g. `fit` or `Fit`. */
  health_status: string
  /** ISO date (yyyy-MM-dd), or null when none is on record. */
  return_to_work: string | null
  /** Null until a photo is uploaded. */
  photo_url: string | null
  is_active: boolean
  /** Timestamp with offset, e.g. `2026-11-19 07:41:27.608949+00:00`. */
  created_at: string
}

/** Response from `POST /people/staff/{staff_id}/photo`. */
export type UploadStaffPhotoResponse = {
  staff_id: string
  photo_url: string
}

/**
 * Request body for `PATCH /people/staff/{staff_id}`. The ID number can't be
 * changed, and the photo has its own endpoints, so neither is sent.
 */
export type UpdateStaffMemberPayload = {
  name: string
  division: Lowercase<StaffDivision>
  role: string
  phone: string
  email: string
  employment_type: StaffEmploymentType
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  daily_rate: number
  health_status: StaffHealthStatus
  /** ISO date (yyyy-MM-dd); only sent when the health status isn't Fit. */
  return_to_work?: string
  /** False blocks them from signing in to their account. */
  is_active: boolean
}

/** Response from `GET /people/dashboard`. */
export type StaffDashboardResponse = {
  total_staff: number
  active_staff: number
  present_today: number
  absent_today: number
  /** Staff whose health status isn't Fit. */
  health_restrictions: number
}

export type StaffDashboard = {
  totalStaff: number
  activeStaff: number
  presentToday: number
  absentToday: number
  /** Staff whose health status isn't Fit. */
  healthRestrictions: number
}

export const emergencyContactRelationships = [
  "Parent",
  "Friend",
  "Spouse",
  "Child",
  "Other",
] as const

export type EmergencyContactRelationship =
  (typeof emergencyContactRelationships)[number]

export type CreateEmergencyContactFormValues = z.infer<
  typeof createEmergencyContactSchema
>

/** Request body for `POST /people/staff/{staff_id}/emergency-contacts`. */
export type CreateEmergencyContactPayload = {
  name: string
  /** Lowercase, e.g. `parent`. */
  relationship: Lowercase<EmergencyContactRelationship>
  phone: string
}

/** An emergency contact as the profile returns it. */
export type EmergencyContactResponse = {
  contact_id: string
  name: string
  relationship: string
  phone: string
}

export type EmergencyContact = {
  id: string
  name: string
  /** One of `emergencyContactRelationships`, unless the API sends another. */
  relationship: string
  phone: string
}

export type CreateStaffSkillFormValues = z.infer<typeof createStaffSkillSchema>

/** Request body for `POST /people/staff/{staff_id}/skills`. */
export type CreateStaffSkillPayload = {
  category: string
  skill: string
  /** "" when none is given. */
  description: string
}

/** A skill as the profile returns it. */
export type StaffSkillResponse = {
  skill_id: string
  category: string
  skill: string
  description: string | null
}

export type StaffSkill = {
  id: string
  /** e.g. `Certification` or `Trade`. */
  category: string
  skill: string
  /** Null when none was given. */
  description: string | null
}

/**
 * Response from `GET /people/staff/{staff_id}/profile`. Assignments and
 * welfare issuances aren't shown yet, so their item shapes aren't typed.
 */
export type StaffProfileResponse = {
  staff: StaffMemberResponse
  skills: StaffSkillResponse[]
  emergency_contacts: EmergencyContactResponse[]
  assignments: unknown[]
  welfare_issuances: unknown[]
}

export type StaffProfile = {
  member: StaffMember
  skills: StaffSkill[]
  emergencyContacts: EmergencyContact[]
}

/** What the photo upload form holds; the photo is null until one is chosen. */
export type UploadStaffPhotoFormInput = z.input<typeof uploadStaffPhotoSchema>

export type UploadStaffPhotoFormValues = z.output<typeof uploadStaffPhotoSchema>

export type AssignProjectFormValues = z.infer<typeof assignProjectSchema>

/** Request body for `POST /people/staff/{staff_id}/assignments`. */
export type AssignProjectPayload = {
  project_id: string
  /** ISO date (yyyy-MM-dd). */
  assigned_from: string
  /** ISO date (yyyy-MM-dd). */
  assigned_to: string
}

/** An assignment as `GET /people/staff/{staff_id}/assignments` returns it. */
export type StaffAssignmentResponse = {
  assignment_id: string
  staff_id: string
  /** The project's reference code. */
  project_id: string
  /** ISO date (yyyy-MM-dd). */
  assigned_from: string
  /** ISO date (yyyy-MM-dd). */
  assigned_to: string
  /** Timestamp with offset, e.g. `2026-11-21 10:37:44.460878+00:00`. */
  created_at: string
}

export type StaffAssignment = {
  id: string
  /** The project's reference code, which is also its id. */
  projectId: string
  /** ISO date (yyyy-MM-dd). */
  assignedFrom: string
  /** ISO date (yyyy-MM-dd). */
  assignedTo: string
  /** Timestamp with offset, e.g. `2026-11-21 10:37:44.460878+00:00`. */
  createdAt: string
}

/** An assignment as `GET /people/assignments?project_id=…` returns it. */
export type ProjectAssignmentResponse = StaffAssignmentResponse & {
  staff_name: string
  staff_role: string
  /** e.g. `Construction`. */
  staff_division: string
}

/** Someone assigned to a project, for a date range. */
export type ProjectAssignment = {
  id: string
  staffId: string
  /** The project's reference code, which is also its id. */
  projectId: string
  staffName: string
  staffRole: string
  staffDivision: string
  /** ISO date (yyyy-MM-dd). */
  assignedFrom: string
  /** ISO date (yyyy-MM-dd). */
  assignedTo: string
}
