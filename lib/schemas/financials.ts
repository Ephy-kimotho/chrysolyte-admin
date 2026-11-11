import { endOfToday, isAfter, isValid, parseISO } from "date-fns"
import { z } from "zod"

import { transactionTypes } from "@/lib/types/financials"

export const createTransactionSchema = z.object({
  type: z.enum(transactionTypes, "Choose the activity type"),
  projectId: z.string("Choose a project").min(1, "Choose a project"),
  date: z
    .string()
    .min(1, "Choose the date")
    .refine((value) => isValid(parseISO(value)), "Enter a valid date")
    .refine(
      (value) => !isAfter(parseISO(value), endOfToday()),
      "The date can't be in the future"
    ),
  description: z.string().trim().min(1, "Describe the activity"),
  amount: z
    .number("Enter the amount in KES")
    .int("Use whole shillings")
    .positive("The amount must be more than 0"),
})
