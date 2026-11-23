import { isValid, parseISO } from "date-fns"

import { axiosInstance } from "@/lib/axios"
import type {
  CreateTransactionFormValues,
  CreateTransactionPayload,
  FinancialTransaction,
  TransactionFilters,
  TransactionResponse,
  UpdateTransactionPayload,
} from "@/lib/types/financials"

const transactionsPath = "/finance/transactions"

/** `2026-11-23 08:49:34.502693+00:00` → `2026-11-23T08:49:34.502Z`. */
function toIsoDateTime(timestamp: string) {
  const date = parseISO(timestamp)
  return isValid(date) ? date.toISOString() : timestamp
}

function toTransaction(transaction: TransactionResponse): FinancialTransaction {
  return {
    id: transaction.transaction_id,
    date: transaction.transaction_date,
    projectId: transaction.project_id,
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
    recordedBy: transaction.recorded_by,
    recordedAt: toIsoDateTime(transaction.created_at),
  }
}

/** Transactions, oldest first, for one project when `filters` names it. */
export async function listTransactions(filters: TransactionFilters = {}) {
  const response = await axiosInstance.get<TransactionResponse[]>(
    transactionsPath,
    // Axios leaves out the undefined ones.
    { params: { project_id: filters.projectId } }
  )
  return (
    response.data
      .map(toTransaction)
      // ISO dates sort as text; same-day ones go in the order recorded.
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.recordedAt.localeCompare(b.recordedAt)
      )
  )
}

/** Records a client receipt or project cost against a project. */
export async function createTransaction(values: CreateTransactionFormValues) {
  const payload: CreateTransactionPayload = {
    project_id: values.projectId,
    transaction_date: values.date,
    type: values.type,
    description: values.description,
    amount: values.amount,
  }

  const response = await axiosInstance.post(transactionsPath, payload)
  return response.data
}

function transactionPath(transactionId: string) {
  return `${transactionsPath}/${encodeURIComponent(transactionId)}`
}

/** Saves changes to a transaction. Its project can't change. */
export async function updateTransaction(
  transactionId: string,
  values: CreateTransactionFormValues
) {
  const payload: UpdateTransactionPayload = {
    transaction_date: values.date,
    type: values.type,
    description: values.description,
    amount: values.amount,
  }

  const response = await axiosInstance.patch(
    transactionPath(transactionId),
    payload
  )
  return response.data
}

export async function deleteTransaction(transactionId: string) {
  await axiosInstance.delete(transactionPath(transactionId))
}

/** What a project's client has paid and what it has cost so far. */
export function sumTransactions(transactions: FinancialTransaction[]) {
  let clientPaid = 0
  let recordedCosts = 0
  for (const transaction of transactions) {
    if (transaction.type === "ClientReceipt") clientPaid += transaction.amount
    else recordedCosts += transaction.amount
  }
  return { clientPaid, recordedCosts }
}
