import type { z } from "zod"

import type { createTransactionSchema } from "@/lib/schemas/financials"

/** Transaction types as the API spells them. */
export const transactionTypes = ["ClientReceipt", "ProjectCost"] as const

export type TransactionType = (typeof transactionTypes)[number]

/** What the screen shows for each transaction type. */
export const transactionTypeLabels = {
  ClientReceipt: "Client Receipt",
  ProjectCost: "Project Cost",
} as const satisfies Record<TransactionType, string>

export type FinancialTransaction = {
  id: string
  /** ISO date (yyyy-MM-dd). */
  date: string
  projectId: string
  type: TransactionType
  description: string
  /** Amount in Kenyan shillings, always positive; `type` gives the direction. */
  amount: number
  /** Staff ID of whoever recorded it. */
  recordedBy: string
  /** ISO date-time it was recorded. */
  recordedAt: string
}

/** A transaction as `GET /finance/transactions` returns it. */
export type TransactionResponse = {
  transaction_id: string
  project_id: string
  /** ISO date (yyyy-MM-dd). */
  transaction_date: string
  type: TransactionType
  description: string
  amount: number
  /** Staff ID of whoever recorded it. */
  recorded_by: string
  /** Timestamp with offset, e.g. `2026-11-23 08:49:34.502693+00:00`. */
  created_at: string
}

/** Query parameters `GET /finance/transactions` can filter by. */
export type TransactionFilters = {
  projectId?: string
}

export type CreateTransactionFormValues = z.infer<
  typeof createTransactionSchema
>

/** Request body for `POST /finance/transactions`. */
export type CreateTransactionPayload = {
  project_id: string
  /** ISO date (yyyy-MM-dd). */
  transaction_date: string
  type: TransactionType
  description: string
  /** In Kenyan shillings. */
  amount: number
}

/** Request body for `PATCH /finance/transactions/{transaction_id}`. */
export type UpdateTransactionPayload = {
  /** ISO date (yyyy-MM-dd). */
  transaction_date: string
  type: TransactionType
  description: string
  /** In Kenyan shillings. */
  amount: number
}
