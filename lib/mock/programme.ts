import type { Milestone } from "@/lib/types/programme"

// Mock milestones that feed the mock projects' progress until the remaining
// mocks go. The programme tab reads the real API (`lib/api/programme.ts`).
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
