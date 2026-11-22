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

/** The statuses the office work log filters by. */
export const officeTaskStatuses = ["Active", "Completed"] as const

/** New tasks start with this status. */
export const newOfficeTaskStatus = "Active"

export type OfficeTask = {
  id: string
  /** The project's reference code, e.g. `CEL-C-280606-011`. */
  projectId: string
  /** One of `officeTaskCategories`, unless the API sends one the app doesn't know. */
  category: string
  task: string
  /** Person responsible for the task. */
  owner: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  /** As the API sends it, e.g. `Active`. */
  status: string
  notes: string | null
}

/** A task as `GET /projects/office-work` returns it. */
export type OfficeTaskResponse = {
  work_id: string
  project_id: string
  /** e.g. `finance`; matched to `officeTaskCategories` ignoring case. */
  category: string
  task: string
  owner: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  progress: number
  status: string
  notes: string | null
  created_by: string
  /** Timestamp with offset, e.g. `2026-11-23T00:36:32.506493+03:00`. */
  created_at: string
  updated_at: string
}

/** What the office work log can be narrowed by. Unset means any. */
export type OfficeTaskFilters = {
  projectId?: string
  status?: string
  category?: string
}

export type CreateOfficeTaskFormValues = z.infer<typeof createOfficeTaskSchema>

/** Request body for `POST /projects/office-work`. */
export type CreateOfficeTaskPayload = {
  project_id: string
  category: string
  task: string
  owner: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  progress: number
  status: string
  notes: string
}

/** Request body for `PATCH /projects/office-work/{work_id}`. */
export type UpdateOfficeTaskPayload = CreateOfficeTaskPayload
