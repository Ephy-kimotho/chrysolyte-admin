import type { z } from "zod"

import type {
  createClientSchema,
  updateClientSchema,
} from "@/lib/schemas/clients"

export type CreateClientFormValues = z.infer<typeof createClientSchema>

/** What the update form holds while editing; phone is a string until parsed. */
export type UpdateClientFormInput = z.input<typeof updateClientSchema>

export type UpdateClientFormValues = z.output<typeof updateClientSchema>

/** Request body for creating a client. */
export type CreateClientPayload = {
  name: string
  contact_name: string
  email: string
  phone: string
  active: boolean
}

/** Request body for updating a client. */
export type UpdateClientPayload = {
  name: string
  contact_name: string
  email: string
  /** Null clears the phone number. */
  phone: string | null
}

/** A client as the API returns it. */
export type ClientResponse = {
  client_id: string
  name: string
  contact_name: string
  email: string
  phone: string | null
  active: boolean
  project_count: number
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  /** Company or individual the work is for. */
  name: string
  /** Person to talk to at the client. */
  contactName: string
  email: string
  /** Null when no phone number is on record. */
  phone: string | null
  active: boolean
  projectCount: number
  /** ISO timestamp with offset, e.g. `2026-11-11T12:10:22.273582+03:00`. */
  createdAt: string
  /** ISO timestamp with offset. */
  updatedAt: string
}
