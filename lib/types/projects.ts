import type { z } from "zod"

import type {
  createProjectSchema,
  uploadProjectPhotoSchema,
} from "@/lib/schemas/projects"

export const projectPhases = ["Design", "Construction"] as const

export type ProjectPhase = (typeof projectPhases)[number]

export const contractTypes = [
  "Full Contract",
  "Labour Only",
  "Management Only",
  "Design Only",
] as const

export type ContractType = (typeof contractTypes)[number]

/** How the API spells each contract type. */
export const contractTypeApiValues = {
  "Full Contract": "FullContract",
  "Labour Only": "LabourOnly",
  "Management Only": "ManagementOnly",
  "Design Only": "DesignOnly",
} as const satisfies Record<ContractType, string>

export type ContractTypeApiValue = (typeof contractTypeApiValues)[ContractType]

export type Project = {
  /** The API identifies a project by its reference code, so this matches `code`. */
  id: string
  /** Reference code, e.g. `CEL-C-260806-001`. */
  code: string
  name: string
  /** The division running the project. */
  phase: ProjectPhase
  /** One of `contractTypes`, unless the API sends one the app doesn't know. */
  contractType: string
  /** Contract value in Kenyan shillings. */
  budget: number
  location: string
  /** Completion percentage, 0–100. */
  progress: number
  /** As the API sends it, e.g. `Active`. */
  status: string
  /** ISO date (yyyy-MM-dd). */
  startDate: string | null
  /** Deadline, as an ISO date (yyyy-MM-dd). */
  dueDate: string
  /** Cover photo URL, or null to show the phase placeholder. */
  coverImageUrl: string | null
  /** The client's name. */
  client: string | null
  clientId: string | null
  /** Staff IDs; look the names up with `useStaffNames`. Null until appointed. */
  supervisorId: string | null
  projectManagerId: string | null
  leadConsultantId: string | null
  /** Note the client can see. */
  clientNote: string | null
  /** Note for staff only, e.g. something to confirm before work goes ahead. */
  internalNote: string | null
}

/** A project as `GET /projects/projects` returns it. */
export type ProjectResponse = {
  /** Reference code, e.g. `CEL-C-280606-011`. */
  project_id: string
  name: string
  /** e.g. `Design` or `Construction`. */
  division: string
  client: string | null
  client_id: string | null
  /** e.g. `DesignOnly`. */
  contract: string
  location: string
  /** ISO date (yyyy-MM-dd). */
  start_date: string | null
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  budget: number
  /** e.g. `Active`. */
  status: string
  photo_url: string | null
  supervisor_id: string | null
  pm_id: string | null
  lead_consultant_id: string | null
  client_note: string | null
  internal_note: string | null
  progress: number
  created_by: string
  /** Timestamp with offset, e.g. `2026-11-19 19:31:56.941876+00:00`. */
  created_at: string
  updated_at: string
}

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>

/**
 * Request body for `POST /projects/projects`. The people and notes are
 * optional, so they're left out when the form leaves them empty.
 */
export type CreateProjectPayload = {
  /** Reference code, e.g. `CEL-C-260806-001`. */
  project_id: string
  name: string
  division: ProjectPhase
  /** The client's name, sent alongside `client_id`. */
  client: string
  client_id: string
  contract: ContractTypeApiValue
  location: string
  /** ISO date (yyyy-MM-dd). */
  start_date: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  /** In Kenyan shillings. */
  budget: number
  supervisor_id?: string
  pm_id?: string
  lead_consultant_id?: string
  /** Note the client can see. */
  client_note?: string
  /** Note for staff only. */
  internal_note?: string
}

/** What the photo upload form holds; the photo is null until one is chosen. */
export type UploadProjectPhotoFormInput = z.input<
  typeof uploadProjectPhotoSchema
>

export type UploadProjectPhotoFormValues = z.output<
  typeof uploadProjectPhotoSchema
>
