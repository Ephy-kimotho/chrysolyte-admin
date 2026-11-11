import { format } from "date-fns"

import type { CreateProjectFormValues, Project } from "@/lib/types/projects"

// In-memory stand-in for a projects API. Changes last until the page reloads.
let projects: Project[] = [
  {
    id: "kilimani-residence",
    code: "CEL-C-260806-001",
    name: "Kilimani Residence",
    phase: "Construction",
    location: "Nairobi",
    progress: 35,
    dueDate: "2026-12-18",
    coverImageUrl: null,
  },
  {
    id: "westlands-corporate-office",
    code: "CEL-D-260806-002",
    name: "Westlands Corporate Office",
    phase: "Design",
    location: "Westlands",
    progress: 39,
    dueDate: "2026-10-30",
    coverImageUrl: null,
  },
  {
    id: "malaba-suites",
    code: "CEL-C-261020-003",
    name: "Malaba Suites",
    phase: "Construction",
    location: "Witeithie",
    progress: 0,
    dueDate: "2026-11-13",
    coverImageUrl: null,
  },
]

/** The current projects, synchronously, for seeding the query cache. */
export function getProjectsSnapshot() {
  return projects
}

export async function listProjects() {
  return projects
}

export async function getProject(id: string) {
  return projects.find((project) => project.id === id) ?? null
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
    name: data.name.trim(),
    phase: data.phase,
    location: data.location.trim(),
    progress: 0,
    dueDate: data.dueDate,
    coverImageUrl: null,
  }
  projects = [...projects, project]
  return project
}

export async function removeProject(id: string) {
  const project = projects.find((item) => item.id === id)
  if (project?.coverImageUrl) URL.revokeObjectURL(project.coverImageUrl)
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
