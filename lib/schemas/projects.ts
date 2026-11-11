import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import { imageFilesSchema } from "@/lib/schemas/files"
import { contractTypes, projectPhases } from "@/lib/types/projects"

const isoDateSchema = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine((value) => isValid(parseISO(value)), "Enter a valid date")

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Enter the project name"),
    client: z.string().trim().min(1, "Enter the client's name"),
    phase: z.enum(projectPhases, "Choose the division"),
    contractType: z.enum(contractTypes, "Choose the contract type"),
    location: z.string().trim().min(1, "Enter the project location"),
    budget: z
      .number("Enter the budget in KES")
      .int("Use whole shillings")
      .positive("The budget must be more than 0"),
    startDate: isoDateSchema("Choose the start date"),
    dueDate: isoDateSchema("Choose the deadline"),
    /** Optional: left empty until someone is appointed. */
    supervisor: z.string().trim(),
    projectManager: z.string().trim(),
    leadConsultant: z.string().trim(),
  })
  .refine((values) => values.dueDate >= values.startDate, {
    // ISO dates compare correctly as text.
    message: "The deadline can't be before the start date",
    path: ["dueDate"],
  })

/** Most site photos a project can hold. */
export const maxProjectPhotos = 20

export const addProjectPhotosSchema = z.object({
  photos: imageFilesSchema(maxProjectPhotos).min(
    1,
    "Choose at least one photo"
  ),
})
