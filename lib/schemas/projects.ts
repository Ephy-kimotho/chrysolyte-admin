import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import { projectPhases } from "@/lib/types/projects"

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Enter the project name"),
  phase: z.enum(projectPhases, "Choose the project phase"),
  location: z.string().trim().min(1, "Enter the project location"),
  dueDate: z
    .string()
    .min(1, "Choose the due date")
    .refine((value) => isValid(parseISO(value)), "Enter a valid date"),
})
