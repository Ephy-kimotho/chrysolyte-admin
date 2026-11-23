import { useMutation, useQueryClient } from "@tanstack/react-query"

import { transactionsQueryKey } from "@/hooks/use-transactions"
import * as financialsApi from "@/lib/api/financials"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { FinancialTransaction } from "@/lib/types/financials"

interface DeleteTransactionOptions {
  transaction: Pick<FinancialTransaction, "id" | "description">
}

/** Deletes a transaction. */
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transaction }: DeleteTransactionOptions) =>
      financialsApi.deleteTransaction(transaction.id),
    onSuccess: (_, { transaction }) => {
      notifySuccess(
        "Transaction deleted",
        `${transaction.description} is no longer on record.`
      )
      return queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (error) => notifyError("Couldn't delete the transaction", error),
  })
}
