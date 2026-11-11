import { isValid, parseISO } from "date-fns"
import { z } from "zod"

export const createDesignDeliverableSchema = z.object({
  projectId: z.string("Choose a project").min(1, "Choose a project"),
  discipline: z.string().trim().min(1, "Enter the discipline"),
  stage: z.string().trim().min(1, "Enter the stage"),
  deliverable: z.string().trim().min(1, "Enter the deliverable"),
  lead: z.string().trim().min(1, "Enter who leads it"),
  deadline: z
    .string()
    .min(1, "Choose the deadline")
    .refine((value) => isValid(parseISO(value)), "Enter a valid date"),
  progress: z
    .number("Enter progress from 0 to 100")
    .int("Use a whole number")
    .min(0, "Progress can't be below 0%")
    .max(100, "Progress can't be above 100%"),
})
