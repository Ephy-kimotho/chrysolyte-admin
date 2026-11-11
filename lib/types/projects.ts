import type { z } from "zod"

import type {
  addProjectPhotosSchema,
  createProjectSchema,
} from "@/lib/schemas/projects"

export const projectPhases = ["Design", "Construction"] as const

export type ProjectPhase = (typeof projectPhases)[number]

export const contractTypes = [
  "Full Contract",
  "Labour Only",
  "Management Only",
  "Design Only",
] as const

export type ContractType = (typeof contractTypes)[number]

export type Project = {
  id: string
  /** Reference code, e.g. `CEL-C-260806-001`. */
  code: string
  name: string
  /** The division running the project. */
  phase: ProjectPhase
  contractType: ContractType
  /** Contract value in Kenyan shillings. */
  budget: number
  location: string
  /** Completion percentage, 0–100, calculated from the project's activities. */
  progress: number
  /** Deadline, as an ISO date (yyyy-MM-dd). */
  dueDate: string
  /** Cover photo URL, or null to show the phase placeholder. */
  coverImageUrl: string | null
  /** Site photos shown on the project page. */
  photoUrls: string[]
  client: string | null
  /** ISO date (yyyy-MM-dd). */
  startDate: string | null
  /** Lead consultant managing the project, e.g. `Eng. Njoroge`. */
  manager: string | null
  supervisor: string | null
  projectManager: string | null
  /** Note for staff only, e.g. something to confirm before work goes ahead. */
  internalNote: string | null
}

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>

export type AddProjectPhotosFormValues = z.infer<typeof addProjectPhotosSchema>
