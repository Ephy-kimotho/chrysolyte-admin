import { endOfToday, isAfter, isValid, parseISO } from "date-fns"
import { z } from "zod"

import { consultantDisciplines } from "@/lib/types/consultants"

const isoDateSchema = (label: string) =>
  z
    .string()
    .min(1, `Choose the ${label}`)
    .refine((value) => isValid(parseISO(value)), "Enter a valid date")

export const createSiteInstructionSchema = z
  .object({
    date: isoDateSchema("date").refine(
      (value) => !isAfter(parseISO(value), endOfToday()),
      "The date can't be in the future"
    ),
    projectId: z.string("Choose a project").min(1, "Choose a project"),
    discipline: z.enum(consultantDisciplines, "Choose the discipline"),
    issuer: z.string().trim().min(1, "Enter who issued the instruction"),
    instruction: z.string().trim().min(1, "Write the instruction"),
    responsibleStaffId: z
      .string("Choose who is responsible")
      .min(1, "Choose who is responsible"),
    deadline: isoDateSchema("deadline"),
  })
  .refine((values) => values.deadline >= values.date, {
    // ISO dates compare correctly as text.
    message: "The deadline can't be before the instruction date",
    path: ["deadline"],
  })
