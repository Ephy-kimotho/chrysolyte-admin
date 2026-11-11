import { differenceInCalendarDays, format, parseISO } from "date-fns"

import type {
  CreateStaffMemberFormValues,
  StaffMember,
} from "@/lib/types/staff"

type StoredStaffMember = Omit<StaffMember, "kpiEfficiency" | "daysSinceActive">

// In-memory stand-in for a staff API. Changes last until the page reloads.
let staff: StoredStaffMember[] = [
  {
    id: "peter-mwangi",
    staffNumber: "ID-001",
    fullName: "Peter Mwangi",
    photoUrl: null,
    email: "peter.mwangi@chrysolyte.co.ke",
    phone: "0712000001",
    division: "Construction",
    role: "Site Supervision",
    dailyRate: 2500,
    qualification: "Diploma in Building Construction",
    competences: ["Site supervision", "QA/QC", "Safety", "Reporting"],
    projectId: "kilimani-residence",
    health: "Fit",
    kpi: { attendance: 95, quality: 88, timeliness: 90, teamwork: 92 },
    lastActiveOn: "2026-11-10",
  },
  {
    id: "james-kamau",
    staffNumber: "ID-002",
    fullName: "James Kamau",
    photoUrl: null,
    email: "james.kamau@chrysolyte.co.ke",
    phone: "0712000002",
    division: "Construction",
    role: "Project Manager",
    dailyRate: 3500,
    qualification: "Trade Test Grade I",
    competences: ["Masonry", "Labour coordination", "Material control"],
    projectId: "kilimani-residence",
    health: "Fit",
    kpi: { attendance: 92, quality: 84, timeliness: 86, teamwork: 89 },
    lastActiveOn: "2026-11-11",
  },
  {
    id: "faith-njeri",
    staffNumber: "ID-003",
    fullName: "Faith Njeri",
    photoUrl: null,
    email: "faith.njeri@chrysolyte.co.ke",
    phone: "0712000003",
    division: "Design",
    role: "Architect",
    dailyRate: 4500,
    qualification: "B.Arch; Registered Graduate",
    competences: ["Architecture", "BIM", "Client coordination", "Detailing"],
    projectId: "westlands-corporate-office",
    health: "Fit",
    kpi: { attendance: 98, quality: 94, timeliness: 91, teamwork: 93 },
    lastActiveOn: "2026-11-05",
  },
  {
    id: "anne-wambui",
    staffNumber: "ID-004",
    fullName: "Anne Wambui",
    photoUrl: null,
    email: "anne.wambui@chrysolyte.co.ke",
    phone: "0712000004",
    division: "Office",
    role: "CFO",
    dailyRate: 6000,
    qualification: "CPA(K)",
    competences: ["Bookkeeping", "Payroll", "Project costing", "Tax"],
    projectId: null,
    health: "Fit",
    kpi: { attendance: 97, quality: 95, timeliness: 94, teamwork: 90 },
    lastActiveOn: "2026-08-06",
  },
  {
    id: "brian-otieno",
    staffNumber: "ID-005",
    fullName: "Brian Otieno",
    photoUrl: null,
    email: "brian.otieno@chrysolyte.co.ke",
    phone: "0712000005",
    division: "Construction",
    role: "Foreman",
    dailyRate: 1800,
    qualification: "Certificate in Masonry",
    competences: ["Masonry", "Formwork", "Setting out"],
    projectId: "malaba-suites",
    health: "Restricted duty",
    kpi: { attendance: 78, quality: 82, timeliness: 74, teamwork: 85 },
    lastActiveOn: "2026-11-02",
  },
]

function withDerived(member: StoredStaffMember): StaffMember {
  const { kpi } = member
  return {
    ...member,
    kpiEfficiency: kpi
      ? Math.round(
          (kpi.attendance + kpi.quality + kpi.timeliness + kpi.teamwork) / 4
        )
      : null,
    daysSinceActive: differenceInCalendarDays(
      new Date(),
      parseISO(member.lastActiveOn)
    ),
  }
}

/** Thrown when a new staff member's staff number or email is already taken. */
export class StaffConflictError extends Error {
  readonly field: "staffNumber" | "email"

  constructor(field: "staffNumber" | "email") {
    super(
      field === "staffNumber"
        ? "This staff number is already in use"
        : "This email address is already in use"
    )
    this.name = "StaffConflictError"
    this.field = field
  }
}

/** The current staff, synchronously, for seeding the query cache. */
export function getStaffSnapshot() {
  return staff.map(withDerived)
}

export async function listStaff() {
  return getStaffSnapshot()
}

export async function createStaffMember(data: CreateStaffMemberFormValues) {
  if (staff.some((member) => member.staffNumber === data.staffNumber)) {
    throw new StaffConflictError("staffNumber")
  }
  if (staff.some((member) => member.email === data.email)) {
    throw new StaffConflictError("email")
  }

  const member: StoredStaffMember = {
    id: crypto.randomUUID(),
    staffNumber: data.staffNumber,
    fullName: data.fullName,
    // Stands in for the URL an upload API would return.
    photoUrl: data.photo ? URL.createObjectURL(data.photo) : null,
    email: data.email,
    phone: data.phone,
    division: data.division,
    role: data.role,
    dailyRate: data.dailyRate,
    qualification: data.qualification,
    competences: data.competences
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter(Boolean),
    projectId: data.projectId,
    health: data.health,
    // Rated at their first KPI review.
    kpi: null,
    lastActiveOn: format(new Date(), "yyyy-MM-dd"),
  }
  staff = [...staff, member]
  return withDerived(member)
}

export async function removeStaffMember(id: string) {
  const member = staff.find((item) => item.id === id)
  if (member?.photoUrl) URL.revokeObjectURL(member.photoUrl)
  staff = staff.filter((item) => item.id !== id)
}
