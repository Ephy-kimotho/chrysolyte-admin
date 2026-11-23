import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import {
  equipmentCategories,
  equipmentConditions,
  welfareCategories,
} from "@/lib/types/stores"

function quantitySchema(label: string) {
  return z
    .number(`Enter the ${label}`)
    .nonnegative(`The ${label} can't be negative`)
}

export const createStockItemSchema = z.object({
  item: z.string().trim().min(1, "Enter the item"),
  unit: z.string().trim().min(1, "Enter the unit, e.g. bags"),
  qty: quantitySchema("quantity"),
  minQty: quantitySchema("minimum quantity"),
  supplier: z.string().trim().min(1, "Enter the supplier"),
})

export const createWelfareItemSchema = z.object({
  category: z.enum(welfareCategories, "Choose a category"),
  item: z.string().trim().min(1, "Enter the item"),
  unit: z.string().trim().min(1, "Enter the unit, e.g. pieces"),
  qty: quantitySchema("quantity"),
  minQty: quantitySchema("minimum quantity"),
})

export const createEquipmentSchema = z
  .object({
    assetNumber: z.string().trim().min(1, "Enter the asset number"),
    item: z.string().trim().min(1, "Enter the item"),
    category: z.enum(equipmentCategories, "Choose a category"),
    qty: z
      .number("Enter the quantity")
      .int("Use a whole number")
      .min(1, "The quantity must be at least 1"),
    condition: z.enum(equipmentConditions, "Choose the condition"),
    /** The project it's assigned to, or "" for the general store. */
    assignedProjectId: z.string(),
    responsibleId: z.string().min(1, "Choose who's responsible for it"),
    issuedDate: z
      .string()
      .min(1, "Choose the issue date")
      .refine((value) => isValid(parseISO(value)), "Enter a valid date"),
    /** Optional, so "" when there's no return date. */
    returnDate: z
      .string()
      .refine(
        (value) => !value || isValid(parseISO(value)),
        "Enter a valid date"
      ),
    /** Optional, so null when it's left blank. */
    purchaseCost: z
      .number("Enter the purchase cost in KES")
      .nonnegative("The purchase cost can't be negative")
      .nullable(),
    maintenanceNotes: z.string().trim(),
  })
  .refine(
    (values) => !values.returnDate || values.returnDate >= values.issuedDate,
    {
      // ISO dates compare correctly as text.
      message: "The return date can't be before the issue date",
      path: ["returnDate"],
    }
  )
