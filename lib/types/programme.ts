import type { z } from "zod"

import type {
  createMilestoneSchema,
  createProgrammeActivitySchema,
  milestoneProgressSchema,
} from "@/lib/schemas/programme"

export type Milestone = {
  id: string
  projectId: string
  name: string
  /** Share of the project, 1–100. A project's weights add up to at most 100. */
  weight: number
  /** Completion percentage, 0–100. */
  progress: number
  /** ISO date (yyyy-MM-dd). */
  startDate: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  owner: string
}

export type ProgrammeActivity = {
  id: string
  projectId: string
  activity: string
  owner: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  /** Material the activity is forecast to use, e.g. `Cement`, or null. */
  material: string | null
  /** Forecast quantity of `material`, or null when there's no material. */
  forecastQuantity: number | null
}

/** A milestone as `GET /projects/projects/{project_id}/milestones` returns it. */
export type MilestoneResponse = {
  milestone_id: string
  project_id: string
  name: string
  weight: number
  progress: number
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  owner: string
}

export type CreateMilestoneFormValues = z.infer<
  ReturnType<typeof createMilestoneSchema>
>

/**
 * Request body for `POST /projects/projects/{project_id}/milestones`, and for
 * `PATCH /projects/milestones/{milestone_id}`.
 */
export type CreateMilestonePayload = {
  name: string
  /** Share of the project, 1–100. */
  weight: number
  /** Completion percentage, 0–100. */
  progress: number
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  owner: string
}

export type MilestoneProgressFormValues = z.infer<
  typeof milestoneProgressSchema
>

export type CreateProgrammeActivityFormValues = z.infer<
  typeof createProgrammeActivitySchema
>
