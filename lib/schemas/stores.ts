import { z } from "zod"

import { equipmentCategories, equipmentConditions } from "@/lib/types/stores"

function quantitySchema(label: string) {
  return z
    .number(`Enter the ${label}`)
    .nonnegative(`The ${label} can't be negative`)
}

export const createStockItemSchema = z.object({
  material: z.string().trim().min(1, "Enter the material"),
  unit: z.string().trim().min(1, "Enter the unit, e.g. bags"),
  available: quantitySchema("available quantity"),
  minimum: quantitySchema("minimum"),
  forecastNeed: quantitySchema("forecast need"),
})

export const createWelfareItemSchema = z.object({
  name: z.string().trim().min(1, "Enter the item"),
  unit: z.string().trim().min(1, "Enter the unit, e.g. kg"),
  quantity: quantitySchema("quantity"),
  minimum: quantitySchema("minimum"),
})

export const createEquipmentSchema = z.object({
  item: z.string().trim().min(1, "Enter the item"),
  category: z.enum(equipmentCategories, "Choose a category"),
  quantity: z
    .number("Enter the quantity")
    .int("Use a whole number")
    .min(1, "The quantity must be at least 1"),
  condition: z.enum(equipmentConditions, "Choose the condition"),
  /** Null keeps it in the general store. */
  assignedProjectId: z.string().nullable(),
})
