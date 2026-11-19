import type {
  CreateProgrammeActivityFormValues,
  Milestone,
  ProgrammeActivity,
} from "@/lib/types/programme"

// In-memory stand-in for the work programme API. The milestones list reads the
// real API (`lib/api/programme.ts`); these mock milestones only feed the mock
// projects' progress until the remaining mocks go. Changes last until the page
// reloads.
const milestones: Milestone[] = [
  {
    id: "kilimani-substructure",
    projectId: "kilimani-residence",
    name: "Substructure",
    weight: 20,
    progress: 82,
    startDate: "2026-07-01",
    deadline: "2026-07-25",
    owner: "James Kamau",
  },
  {
    id: "kilimani-ground-floor",
    projectId: "kilimani-residence",
    name: "Ground floor structure",
    weight: 25,
    progress: 58,
    startDate: "2026-07-26",
    deadline: "2026-08-25",
    owner: "Peter Mwangi",
  },
  {
    id: "kilimani-upper-floor",
    projectId: "kilimani-residence",
    name: "Upper floor structure",
    weight: 25,
    progress: 35,
    startDate: "2026-08-26",
    deadline: "2026-10-05",
    owner: "Peter Mwangi",
  },
  {
    id: "kilimani-finishes",
    projectId: "kilimani-residence",
    name: "Finishes and services",
    weight: 30,
    progress: 0,
    startDate: "2026-10-06",
    deadline: "2026-12-18",
    owner: "Eng. Njoroge",
  },
]

let activities: ProgrammeActivity[] = [
  {
    id: "kilimani-ground-walling",
    projectId: "kilimani-residence",
    activity: "Complete ground floor walling",
    owner: "James Kamau",
    deadline: "2026-08-12",
    progress: 60,
    material: "Cement",
    forecastQuantity: 80,
  },
  {
    id: "kilimani-column-formwork",
    projectId: "kilimani-residence",
    activity: "Column formwork",
    owner: "Peter Mwangi",
    deadline: "2026-08-15",
    progress: 45,
    material: "Timber",
    forecastQuantity: 120,
  },
]

/**
 * Overall progress from milestone weight × milestone completion, rounded to a
 * whole percentage, or null when the project has no milestones yet.
 */
export function getMilestoneProgress(projectId: string) {
  const projectMilestones = milestones.filter(
    (item) => item.projectId === projectId
  )
  if (projectMilestones.length === 0) return null
  const weighted = projectMilestones.reduce(
    (total, item) => total + item.weight * item.progress,
    0
  )
  return Math.round(weighted / 100)
}

export async function listProgrammeActivities(projectId: string) {
  return activities
    .filter((item) => item.projectId === projectId)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

export async function createProgrammeActivity(
  projectId: string,
  data: CreateProgrammeActivityFormValues
) {
  const activity: ProgrammeActivity = {
    id: crypto.randomUUID(),
    projectId,
    ...data,
    material: data.material || null,
  }
  activities = [...activities, activity]
  return activity
}
