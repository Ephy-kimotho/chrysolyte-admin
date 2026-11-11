import type { z } from "zod"

import type {
  createEquipmentSchema,
  createStockItemSchema,
  createWelfareItemSchema,
} from "@/lib/schemas/stores"

/** A construction material held in a project's site store. */
export type StockItem = {
  id: string
  material: string
  /** Unit the quantities are counted in, e.g. `bags`. */
  unit: string
  available: number
  /** Restock when `available` drops below this. */
  minimum: number
  /** Quantity the remaining work is forecast to need. */
  forecastNeed: number
}

export type MaterialStore = {
  projectId: string
  projectName: string
  items: StockItem[]
}

export type WelfareItem = {
  id: string
  name: string
  unit: string
  quantity: number
  /** Restock when `quantity` drops below this. */
  minimum: number
}

export type WelfareStore = {
  id: string
  /** e.g. `Food store`. */
  name: string
  items: WelfareItem[]
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

export type Equipment = {
  id: string
  item: string
  category: EquipmentCategory
  quantity: number
  condition: EquipmentCondition
  /** Project it's assigned to, or null when it's in the general store. */
  assignedProjectId: string | null
  /** The project's reference code, or null for the general store. */
  assignedProjectCode: string | null
}

export type Stores = {
  materialStores: MaterialStore[]
  welfareStores: WelfareStore[]
  equipment: Equipment[]
}

export type CreateStockItemFormValues = z.infer<typeof createStockItemSchema>

export type CreateWelfareItemFormValues = z.infer<
  typeof createWelfareItemSchema
>

export type CreateEquipmentFormValues = z.infer<typeof createEquipmentSchema>
