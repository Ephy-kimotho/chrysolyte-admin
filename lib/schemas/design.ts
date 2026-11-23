import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import { designStages } from "@/lib/types/design"
import { instructionDisciplines } from "@/lib/types/projects"

/**
 * The fields both deliverable forms hold. Only the update form shows
 * `clientApproved`; a new deliverable always starts as pending.
 */
export const designDeliverableSchema = z.object({
  projectId: z.string("Choose a project").min(1, "Choose a project"),
  discipline: z.enum(instructionDisciplines, "Choose the discipline"),
  stage: z.enum(designStages, "Choose the stage"),
  deliverable: z.string().trim().min(1, "Enter the deliverable"),
  leadId: z.string("Choose who leads it").min(1, "Choose who leads it"),
  reviewerId: z.string("Choose who reviews it").min(1, "Choose who reviews it"),
  deadline: z
    .string()
    .min(1, "Choose the deadline")
    .refine((value) => isValid(parseISO(value)), "Enter a valid date"),
  progress: z
    .number("Enter progress from 0 to 100")
    .int("Use a whole number")
    .min(0, "Progress can't be below 0%")
    .max(100, "Progress can't be above 100%"),
  /** Whether the client has approved it. */
  clientApproved: z.boolean(),
})
