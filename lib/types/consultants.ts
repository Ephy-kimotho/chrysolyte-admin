import type { z } from "zod"

import type { createSiteInstructionSchema } from "@/lib/schemas/consultants"

export const consultantDisciplines = [
  "Architect",
  "Structural Engineer",
  "Site Engineer",
  "Quantity Surveyor",
  "MEP Engineer",
] as const

export type ConsultantDiscipline = (typeof consultantDisciplines)[number]

export const siteInstructionStatuses = ["Open", "Closed"] as const

export type SiteInstructionStatus = (typeof siteInstructionStatuses)[number]

export type SiteInstruction = {
  id: string
  /** ISO date (yyyy-MM-dd) the instruction was issued. */
  date: string
  projectId: string
  projectName: string
  discipline: ConsultantDiscipline
  /** The consultant who issued it, e.g. `Eng. Njoroge`. */
  issuer: string
  instruction: string
  /** Staff member responsible for carrying it out. */
  responsibleStaffId: string
  responsibleName: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  status: SiteInstructionStatus
}

export type CreateSiteInstructionFormValues = z.infer<
  typeof createSiteInstructionSchema
>
