import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import { officeTaskCategories } from "@/lib/types/coo-operations"

export const createOfficeTaskSchema = z.object({
  category: z.enum(officeTaskCategories, "Choose a category"),
  task: z.string().trim().min(1, "Describe the task"),
  owner: z.string().trim().min(1, "Enter who owns the task"),
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
