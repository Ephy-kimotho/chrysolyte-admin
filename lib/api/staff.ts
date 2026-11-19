import { axiosInstance } from "@/lib/axios"
import {
  emergencyContactRelationships,
  staffDivisions,
  staffHealthStatuses,
  type CreateEmergencyContactFormValues,
  type CreateEmergencyContactPayload,
  type CreateStaffMemberFormValues,
  type EmergencyContactRelationship,
  type CreateStaffMemberPayload,
  type CreateStaffSkillFormValues,
  type CreateStaffSkillPayload,
  type StaffDashboard,
  type StaffDashboardResponse,
  type StaffDivision,
  type StaffFilters,
  type StaffMember,
  type StaffMemberResponse,
  type StaffProfile,
  type StaffProfileResponse,
  type UpdateStaffMemberFormValues,
  type UpdateStaffMemberPayload,
  type UploadStaffPhotoResponse,
} from "@/lib/types/staff"

/**
 * The API's casing varies (`fit` and `Fit` both come back), so match known
 * values case-insensitively. An unknown value passes through unchanged.
 */
function matchKnown(options: readonly string[], value: string) {
  const lower = value.toLowerCase()
  return options.find((option) => option.toLowerCase() === lower) ?? value
}

function toStaffMember(member: StaffMemberResponse): StaffMember {
  return {
    id: member.staff_id,
    idNo: member.id_no,
    fullName: member.name,
    photoUrl: member.photo_url,
    email: member.email,
    phone: member.phone,
    division: matchKnown(staffDivisions, member.division),
    role: member.role,
    employmentType: member.employment_type,
    startDate: member.start_date,
    dailyRate: member.daily_rate,
    health: matchKnown(staffHealthStatuses, member.health_status),
    returnToWork: member.return_to_work,
    isActive: member.is_active,
    createdAt: member.created_at,
    // Not returned by the staff API yet.
    projectId: null,
    kpi: null,
    kpiEfficiency: null,
    lastActiveOn: null,
    daysSinceActive: null,
  }
}

/** Lists staff, filtered by division and active status when they're given. */
export async function listStaff({ division, activeOnly }: StaffFilters = {}) {
  const response = await axiosInstance.get<StaffMemberResponse[]>(
    "/people/staff",
    {
      params: {
        division: division?.toLowerCase(),
        active_only: activeOnly,
      },
    }
  )
  return response.data.map(toStaffMember)
}

/**
 * One staff member's profile with their skills and emergency contacts.
 * Assignments and welfare issuances aren't used yet.
 */
export async function getStaffProfile(staffId: string): Promise<StaffProfile> {
  const response = await axiosInstance.get<StaffProfileResponse>(
    `/people/staff/${staffId}/profile`
  )
  const profile = response.data

  return {
    member: toStaffMember(profile.staff),
    skills: profile.skills.map((skill) => ({
      id: skill.skill_id,
      category: skill.category,
      skill: skill.skill,
      description: skill.description || null,
    })),
    emergencyContacts: profile.emergency_contacts.map((contact) => ({
      id: contact.contact_id,
      name: contact.name,
      relationship: matchKnown(
        emergencyContactRelationships,
        contact.relationship
      ),
      phone: contact.phone,
    })),
  }
}

export async function createEmergencyContact(
  staffId: string,
  values: CreateEmergencyContactFormValues
) {
  const payload: CreateEmergencyContactPayload = {
    name: values.name,
    relationship:
      values.relationship.toLowerCase() as Lowercase<EmergencyContactRelationship>,
    phone: values.phone,
  }

  const response = await axiosInstance.post(
    `/people/staff/${staffId}/emergency-contacts`,
    payload
  )
  return response.data
}

export async function createStaffSkill(
  staffId: string,
  values: CreateStaffSkillFormValues
) {
  const payload: CreateStaffSkillPayload = {
    category: values.category,
    skill: values.skill,
    description: values.description,
  }

  const response = await axiosInstance.post(
    `/people/staff/${staffId}/skills`,
    payload
  )
  return response.data
}

export async function deleteStaffSkill(skillId: string) {
  await axiosInstance.delete(`/people/skills/${skillId}`)
}

export async function deleteEmergencyContact(contactId: string) {
  await axiosInstance.delete(`/people/emergency-contacts/${contactId}`)
}

/** Staff headcounts for the Staff & KPI page. */
export async function getStaffDashboard(): Promise<StaffDashboard> {
  const response =
    await axiosInstance.get<StaffDashboardResponse>("/people/dashboard")
  const stats = response.data

  return {
    totalStaff: stats.total_staff,
    activeStaff: stats.active_staff,
    presentToday: stats.present_today,
    absentToday: stats.absent_today,
    healthRestrictions: stats.health_restrictions,
  }
}

// The photo isn't part of this request; see `uploadStaffPhoto`.
export async function createStaffMember(values: CreateStaffMemberFormValues) {
  const payload: CreateStaffMemberPayload = {
    name: values.fullName,
    division: values.division.toLowerCase() as Lowercase<StaffDivision>,
    role: values.role,
    phone: values.phone,
    email: values.email,
    id_no: values.idNo,
    employment_type: values.employmentType,
    start_date: values.startDate,
    daily_rate: values.dailyRate,
    health_status: values.health,
    ...(values.health !== "Fit" && { return_to_work: values.returnToWork }),
  }

  const response = await axiosInstance.post<StaffMemberResponse>(
    "/people/staff",
    payload
  )
  return response.data
}

export async function updateStaffMember(
  staffId: string,
  values: UpdateStaffMemberFormValues
) {
  const payload: UpdateStaffMemberPayload = {
    name: values.fullName,
    division: values.division.toLowerCase() as Lowercase<StaffDivision>,
    role: values.role,
    phone: values.phone,
    email: values.email,
    employment_type: values.employmentType,
    start_date: values.startDate,
    daily_rate: values.dailyRate,
    health_status: values.health,
    ...(values.health !== "Fit" && { return_to_work: values.returnToWork }),
    is_active: values.isActive,
  }

  const response = await axiosInstance.patch<StaffMemberResponse>(
    `/people/staff/${staffId}`,
    payload
  )
  return response.data
}

/** Deletes a staff member with their skills and emergency contacts. */
export async function deleteStaffMember(staffId: string) {
  await axiosInstance.delete(`/people/staff/${staffId}`)
}

export async function deleteStaffPhoto(staffId: string) {
  await axiosInstance.delete(`/people/staff/${staffId}/photo`)
}

/** Uploads a staff member's profile photo, replacing any they had. */
export async function uploadStaffPhoto(staffId: string, photo: File) {
  const body = new FormData()
  body.append("file", photo)

  // Axios sets the multipart Content-Type, boundary included, for FormData.
  const response = await axiosInstance.post<UploadStaffPhotoResponse>(
    `/people/staff/${staffId}/photo`,
    body
  )
  return response.data
}
