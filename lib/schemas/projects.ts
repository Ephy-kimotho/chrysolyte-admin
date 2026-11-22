import { endOfToday, isAfter, isValid, parseISO } from "date-fns"
import { z } from "zod"

import { imageFileSchema } from "@/lib/schemas/files"
import {
  contractTypes,
  instructionDisciplines,
  projectPhases,
} from "@/lib/types/projects"

const isoDateSchema = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine((value) => isValid(parseISO(value)), "Enter a valid date")

export const createProjectSchema = z
  .object({
    /**
     * Optional; the division placeholder shows until a cover is added. It
     * isn't part of the create request; it uploads once the project exists.
     */
    coverPhoto: imageFileSchema.nullable(),
    /** Reference code, e.g. `CEL-C-260806-001`. */
    projectCode: z.string().trim().toUpperCase().min(1, "Enter the project ID"),
    name: z.string().trim().min(1, "Enter the project name"),
    clientId: z.string().min(1, "Choose the client"),
    /** The chosen client's name; the API takes it alongside the ID. */
    client: z.string(),
    phase: z.enum(projectPhases, "Choose the division"),
    contractType: z.enum(contractTypes, "Choose the contract type"),
    location: z.string().trim().min(1, "Enter the project location"),
    budget: z
      .number("Enter the budget in KES")
      .int("Use whole shillings")
      .positive("The budget must be more than 0"),
    startDate: isoDateSchema("Choose the start date"),
    dueDate: isoDateSchema("Choose the deadline"),
    /** Optional staff IDs: left empty until someone is appointed. */
    supervisorId: z.string(),
    projectManagerId: z.string(),
    leadConsultantId: z.string(),
    clientNote: z.string().trim(),
    internalNote: z.string().trim(),
  })
  .refine((values) => values.dueDate >= values.startDate, {
    // ISO dates compare correctly as text.
    message: "The deadline can't be before the start date",
    path: ["dueDate"],
  })

export const uploadProjectPhotoSchema = z.object({
  // Null until a photo is chosen, so the field can start empty.
  photo: imageFileSchema
    .nullable()
    .refine((photo) => photo !== null, "Choose a photo to upload"),
})

export const createProjectInstructionSchema = z
  .object({
    issueDate: isoDateSchema("Choose the date issued").refine(
      (value) => !isAfter(parseISO(value), endOfToday()),
      "The date can't be in the future"
    ),
    discipline: z.enum(instructionDisciplines, "Choose the discipline"),
    instruction: z.string().trim().min(1, "Write the instruction"),
    responsibleId: z
      .string("Choose who is responsible")
      .min(1, "Choose who is responsible"),
    deadline: isoDateSchema("Choose the deadline"),
  })
  .refine((values) => values.deadline >= values.issueDate, {
    // ISO dates compare correctly as text.
    message: "The deadline can't be before the date issued",
    path: ["deadline"],
  })
