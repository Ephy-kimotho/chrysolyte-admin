import type { z } from "zod"

import type { createTransactionSchema } from "@/lib/schemas/financials"

export const contractTypes = ["Full Contract", "Design Only"] as const

export type ContractType = (typeof contractTypes)[number]

export const transactionTypes = ["Client receipt", "Project cost"] as const

export type TransactionType = (typeof transactionTypes)[number]

export type FinancialTransaction = {
  id: string
  /** ISO date (yyyy-MM-dd). */
  date: string
  projectId: string
  projectName: string
  type: TransactionType
  description: string
  /** Amount in Kenyan shillings, always positive; `type` gives the direction. */
  amount: number
}

/** Amounts are in Kenyan shillings. */
export type ProjectFinancials = {
  projectId: string
  /** Reference code, e.g. `CEL-C-260806-001`. */
  code: string
  name: string
  /** Null until the project's contract is set up. */
  contractType: ContractType | null
  /** Contract value; null until the contract is set up. */
  budget: number | null
  /** Sum of client receipts. */
  clientPaid: number
  /** Sum of project costs. */
  recordedCosts: number
  weeklyWagesDue: number
  /** Budget minus recorded costs. */
  budgetRemaining: number | null
  /** Budget minus client receipts: what the client still owes. */
  clientBalance: number | null
}

export type Financials = {
  projects: ProjectFinancials[]
  /** Oldest first. */
  transactions: FinancialTransaction[]
}

export type CreateTransactionFormValues = z.infer<
  typeof createTransactionSchema
>
