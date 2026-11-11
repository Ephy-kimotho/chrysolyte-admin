import type { z } from "zod"

import type { createOfficeTaskSchema } from "@/lib/schemas/coo-operations"

export const officeTaskCategories = [
  "Administration",
  "Procurement",
  "Finance",
  "HR",
  "Compliance",
  "Communication",
  "Internal controls",
] as const

export type OfficeTaskCategory = (typeof officeTaskCategories)[number]

export type OfficeTaskStatus = "Active" | "Overdue" | "Completed"

export type OfficeTask = {
  id: string
  category: OfficeTaskCategory
  task: string
  /** Person responsible for the task. */
  owner: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  /** Derived from progress and deadline. */
  status: OfficeTaskStatus
}

export type CreateOfficeTaskFormValues = z.infer<typeof createOfficeTaskSchema>
