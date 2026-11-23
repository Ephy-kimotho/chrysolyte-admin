import type { z } from "zod"

import type {
  createEquipmentSchema,
  createStockItemSchema,
  createWelfareItemSchema,
} from "@/lib/schemas/stores"

/** The welfare store categories. `GET /projects/welfare-stores` can filter by one. */
export const welfareCategories = ["Food", "Beddings", "Toiletries"] as const

export type WelfareCategory = (typeof welfareCategories)[number]

export function isWelfareCategory(value: string): value is WelfareCategory {
  return (welfareCategories as readonly string[]).includes(value)
}

/** Common welfare units offered as one-tap choices. Any other unit can be typed. */
export const welfareUnitSuggestions = [
  "pieces",
  "kg",
  "bags",
  "packets",
  "litres",
  "bars",
  "rolls",
  "pairs",
] as const

/** An item in a welfare store, from `GET /projects/welfare-stores`. */
export type WelfareItemResponse = {
  welfare_store_id: string
  category: string
  item: string
  qty: number
  min_qty: number
  unit: string
  /** e.g. `2026-11-23T21:27:47.928594+03:00`. */
  updated_at: string
  /** True once `qty` drops below `min_qty`. */
  low: boolean
}

export type WelfareItem = {
  id: string
  /** Usually one of `welfareCategories`. */
  category: string
  item: string
  quantity: number
  /** Restock when `quantity` drops below this. */
  minimum: number
  /** e.g. `pieces`. */
  unit: string
  /** ISO date and time of the last change. */
  updatedAt: string
  isLow: boolean
}

export type WelfareItemFilters = {
  category?: WelfareCategory
}

/** Body of `POST /projects/welfare-stores` and `PATCH /projects/welfare-stores/{welfare_store_id}`. */
export type CreateWelfareItemPayload = {
  category: WelfareCategory
  item: string
  qty: number
  min_qty: number
  unit: string
}

export const equipmentCategories = [
  "Plant",
  "Power tool",
  "Hand tool",
  "Safety equipment",
  "Vehicle",
] as const

export type EquipmentCategory = (typeof equipmentCategories)[number]

export const equipmentConditions = ["Good", "Fair", "Needs repair"] as const

export type EquipmentCondition = (typeof equipmentConditions)[number]

export function isEquipmentCategory(
  value: string | null
): value is EquipmentCategory {
  return (equipmentCategories as readonly (string | null)[]).includes(value)
}

export function isEquipmentCondition(
  value: string | null
): value is EquipmentCondition {
  return (equipmentConditions as readonly (string | null)[]).includes(value)
}

/**
 * Equipment from `GET /projects/equipment`. The shape is assumed from the
 * create payload, so fields other than the id are treated as possibly missing.
 */
export type EquipmentResponse = {
  equipment_id: string
  asset_number?: string | null
  item: string
  category?: string | null
  qty: number
  condition?: string | null
  /** The project it's assigned to, or null for the general store. */
  assigned_to?: string | null
  responsible_id?: string | null
  issued_date?: string | null
  return_date?: string | null
  purchase_cost?: number | null
  maintenance_notes?: string | null
}

export type Equipment = {
  id: string
  assetNumber: string | null
  item: string
  /** Usually one of `equipmentCategories`. */
  category: string | null
  quantity: number
  /** Usually one of `equipmentConditions`. */
  condition: string | null
  /** The project it's assigned to, or null when it's in the general store. */
  assignedProjectId: string | null
  responsibleId: string | null
  /** ISO date. */
  issuedDate: string | null
  /** ISO date. */
  returnDate: string | null
  /** In KES. */
  purchaseCost: number | null
  maintenanceNotes: string | null
}

export type EquipmentFilters = {
  condition?: EquipmentCondition
  /** A project id. */
  assignedTo?: string
}

/** Common units offered as one-tap choices. Any other unit can be typed. */
export const stockUnitSuggestions = [
  "pieces",
  "bags",
  "kg",
  "tonnes",
  "metres",
  "lengths",
  "litres",
  "sheets",
] as const

export type CreateStockItemFormValues = z.infer<typeof createStockItemSchema>

/** An item in a project's site store, from `GET /projects/projects/{project_id}/store`. */
export type ProjectStoreItemResponse = {
  store_id: string
  project_id: string
  item: string
  qty: number
  min_qty: number
  unit: string
  supplier: string
  /** e.g. `2026-11-23T18:27:32.313567+03:00`. */
  updated_at: string
  /** True once `qty` drops below `min_qty`. */
  low: boolean
}

export type ProjectStoreItem = {
  id: string
  projectId: string
  item: string
  quantity: number
  /** Restock when `quantity` drops below this. */
  minimum: number
  /** e.g. `bags`. */
  unit: string
  supplier: string
  /** ISO date and time of the last change. */
  updatedAt: string
  isLow: boolean
}

/** Body of `POST /projects/projects/{project_id}/store` and `PATCH /projects/store/{store_id}`. */
export type CreateStockItemPayload = {
  item: string
  qty: number
  min_qty: number
  unit: string
  supplier: string
}

export type CreateWelfareItemFormValues = z.infer<
  typeof createWelfareItemSchema
>

export type CreateEquipmentFormValues = z.infer<typeof createEquipmentSchema>

/**
 * Body of `POST /projects/equipment`. The optional fields are left out when
 * they're blank.
 */
export type CreateEquipmentPayload = {
  asset_number: string
  item: string
  category: EquipmentCategory
  qty: number
  condition: EquipmentCondition
  /** The project it's assigned to. Left out for the general store. */
  assigned_to?: string
  responsible_id: string
  /** ISO date, e.g. `2026-11-23`. */
  issued_date: string
  return_date?: string
  /** In KES. */
  purchase_cost?: number
  maintenance_notes?: string
}

/**
 * Body of `PATCH /projects/equipment/{equipment_id}`. Blank optional fields are
 * null, so clearing one takes effect.
 */
export type UpdateEquipmentPayload = Omit<
  CreateEquipmentPayload,
  "assigned_to" | "return_date" | "purchase_cost" | "maintenance_notes"
> & {
  assigned_to: string | null
  return_date: string | null
  purchase_cost: number | null
  maintenance_notes: string | null
}
