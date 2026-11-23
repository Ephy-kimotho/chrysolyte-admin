import type { z } from "zod"

import type { designDeliverableSchema } from "@/lib/schemas/design"
import type { InstructionDiscipline } from "@/lib/types/projects"

export const clientApprovalStatuses = [
  "Pending",
  "Approved",
  "Rejected",
] as const

export type ClientApprovalStatus = (typeof clientApprovalStatuses)[number]

/** The design stages a deliverable can belong to. */
export const designStages = [
  "Concept",
  "Schematic",
  "Detailed Design",
  "Tender",
  "Construction",
] as const

export type DesignStage = (typeof designStages)[number]

/** New deliverables start with this status. */
export const newDesignDeliverableStatus = "Active"

export type DesignDeliverable = {
  id: string
  projectId: string
  /** One of `instructionDisciplines`, unless the API sends one the app doesn't know. */
  discipline: string
  /** One of `designStages`, unless the API sends one the app doesn't know. */
  stage: string
  deliverable: string
  /** Staff ID of the person leading it; look the name up with `useStaffNames`. */
  leadId: string
  /** Staff ID of the person reviewing it. */
  reviewerId: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  /** As the API sends it, e.g. `open`. */
  status: string
  /** One of `clientApprovalStatuses`, unless the API sends one the app doesn't know. */
  clientApproval: string
}

/** A deliverable as `GET /projects/projects/{project_id}/design` returns it. */
export type DesignDeliverableResponse = {
  design_id: string
  project_id: string
  /** e.g. `architecture`; the casing can differ from `instructionDisciplines`. */
  discipline: string
  stage: string
  deliverable: string
  lead_id: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  progress: number
  status: string
  reviewer_id: string
  client_approval: string
  /** Timestamp with offset, e.g. `2026-11-23T10:16:16.452928+03:00`. */
  created_at: string
  updated_at: string
}

export type DesignDeliverableFormValues = z.infer<
  typeof designDeliverableSchema
>

/**
 * Request body for `POST /projects/projects/{project_id}/design` and
 * `PATCH /projects/design/{design_id}`.
 */
export type CreateDesignDeliverablePayload = {
  discipline: InstructionDiscipline
  stage: DesignStage
  deliverable: string
  /** Staff ID of the person leading the deliverable. */
  lead_id: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  status: string
  /** Staff ID of the person reviewing the deliverable. */
  reviewer_id: string
  /** A new deliverable starts as `Pending` until the client reviews it. */
  client_approval: string
}
