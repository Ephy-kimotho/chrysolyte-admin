import { format } from "date-fns"

import { getMilestoneProgress } from "@/lib/mock/programme"
import type { CreateProjectFormValues, Project } from "@/lib/types/projects"

// In-memory stand-in for a projects API. Changes last until the page reloads.
let projects: Project[] = [
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
    photoUrls: [],
    client: "Demo Client",
    startDate: "2026-07-01",
    manager: "Eng. Njoroge",
    supervisor: "Peter Mwangi",
    projectManager: "James Kamau",
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
    photoUrls: [],
    client: "Malaba Developers Ltd",
    startDate: "2026-10-20",
    manager: "Eng. Otieno",
    supervisor: "Brian Otieno",
    projectManager: null,
    internalNote: null,
  },
]

/** Projects with milestones take their progress from them. */
function withProgress(project: Project): Project {
  const progress = getMilestoneProgress(project.id)
  return progress === null ? project : { ...project, progress }
}

/** The current projects, synchronously, for seeding the query cache. */
export function getProjectsSnapshot() {
  return projects.map(withProgress)
}

export async function listProjects() {
  return getProjectsSnapshot()
}

export async function getProject(id: string) {
  const project = projects.find((item) => item.id === id)
  return project ? withProgress(project) : null
}

/** Builds the next reference code, e.g. `CEL-C-261110-004`. */
function nextProjectCode(phase: Project["phase"]) {
  const lastSequence = Math.max(
    0,
    ...projects.map((project) => Number(project.code.split("-").at(-1)))
  )
  const sequence = String(lastSequence + 1).padStart(3, "0")
  return `CEL-${phase[0]}-${format(new Date(), "yyMMdd")}-${sequence}`
}

export async function createProject(data: CreateProjectFormValues) {
  const project: Project = {
    id: crypto.randomUUID(),
    code: nextProjectCode(data.phase),
    name: data.name,
    phase: data.phase,
    contractType: data.contractType,
    budget: data.budget,
    location: data.location,
    progress: 0,
    dueDate: data.dueDate,
    coverImageUrl: null,
    photoUrls: [],
    client: data.client,
    startDate: data.startDate,
    // The people are optional; an empty field means not appointed yet.
    manager: data.leadConsultant || null,
    supervisor: data.supervisor || null,
    projectManager: data.projectManager || null,
    internalNote: null,
  }
  projects = [...projects, project]
  return project
}

export async function removeProject(id: string) {
  const project = projects.find((item) => item.id === id)
  if (project?.coverImageUrl) URL.revokeObjectURL(project.coverImageUrl)
  project?.photoUrls.forEach((url) => URL.revokeObjectURL(url))
  projects = projects.filter((item) => item.id !== id)
}

export async function updateProjectCover(id: string, file: File) {
  const coverImageUrl = URL.createObjectURL(file)
  projects = projects.map((project) => {
    if (project.id !== id) return project
    if (project.coverImageUrl) URL.revokeObjectURL(project.coverImageUrl)
    return { ...project, coverImageUrl }
  })
}

export async function addProjectPhotos(id: string, files: File[]) {
  // Stands in for the URLs an upload API would return.
  const photoUrls = files.map((file) => URL.createObjectURL(file))
  projects = projects.map((project) =>
    project.id === id
      ? { ...project, photoUrls: [...project.photoUrls, ...photoUrls] }
      : project
  )
}
