import type { z } from "zod"

import type { createProjectSchema } from "@/lib/schemas/projects"

export const projectPhases = ["Design", "Construction"] as const

export type ProjectPhase = (typeof projectPhases)[number]

export type Project = {
  id: string
  /** Reference code, e.g. `CEL-C-260806-001`. */
  code: string
  name: string
  phase: ProjectPhase
  location: string
  /** Completion percentage, 0–100, calculated from the project's activities. */
  progress: number
  /** ISO date (yyyy-MM-dd). */
  dueDate: string
  /** Cover photo URL, or null to show the phase placeholder. */
  coverImageUrl: string | null
}

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>
