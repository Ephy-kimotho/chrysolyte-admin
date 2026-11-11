import type { z } from "zod"

import type { createDesignDeliverableSchema } from "@/lib/schemas/design"

export const clientApprovalStatuses = [
  "Pending",
  "Approved",
  "Rejected",
] as const

export type ClientApprovalStatus = (typeof clientApprovalStatuses)[number]

export type DesignDeliverable = {
  id: string
  projectId: string
  projectName: string
  discipline: string
  stage: string
  deliverable: string
  /** Person leading the deliverable. */
  lead: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** Completion percentage, 0–100. */
  progress: number
  clientApproval: ClientApprovalStatus
}

export type CreateDesignDeliverableFormValues = z.infer<
  typeof createDesignDeliverableSchema
>
