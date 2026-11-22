import { getMilestoneProgress } from "@/lib/mock/programme"
import type { Project } from "@/lib/types/projects"

// In-memory projects that the mocks still standing in for other APIs (design,
// stores, financials, consultants) refer to by id. The project pages read the
// real API (`lib/api/projects.ts`).
const projects: Project[] = [
  {
    id: "kilimani-residence",
    code: "CEL-C-260806-001",
    name: "Kilimani Residence",
    phase: "Construction",
    contractType: "Full Contract",
    budget: 12_500_000,
    location: "Nairobi",
    progress: 35,
    dueDate: "2026-12-18",
    coverImageUrl: null,
    client: "Demo Client",
    startDate: "2026-07-01",
    status: "Active",
    clientId: null,
    supervisorId: null,
    projectManagerId: null,
    leadConsultantId: null,
    clientNote: null,
    internalNote: "Window schedule requires confirmation before publication.",
  },
  {
    id: "malaba-suites",
    code: "CEL-C-261020-003",
    name: "Malaba Suites",
    phase: "Construction",
    contractType: "Full Contract",
    budget: 18_000_000,
    location: "Witeithie",
    progress: 0,
    dueDate: "2026-11-13",
    coverImageUrl: null,
    client: "Malaba Developers Ltd",
    startDate: "2026-10-20",
    status: "Active",
    clientId: null,
    supervisorId: null,
    projectManagerId: null,
    leadConsultantId: null,
    clientNote: null,
    internalNote: null,
  },
]

/** Projects with milestones take their progress from them. */
function withProgress(project: Project): Project {
  const progress = getMilestoneProgress(project.id)
  return progress === null ? project : { ...project, progress }
}

/** The current mock projects, synchronously. */
export function getProjectsSnapshot() {
  return projects.map(withProgress)
}
