import { useMutation, useQueryClient } from "@tanstack/react-query"

import { transactionsQueryKey } from "@/hooks/use-transactions"
import * as financialsApi from "@/lib/api/financials"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  CreateTransactionFormValues,
  FinancialTransaction,
} from "@/lib/types/financials"

interface UpdateTransactionOptions {
  transaction: Pick<FinancialTransaction, "id">
  data: CreateTransactionFormValues
}

/** Saves changes to a transaction. */
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transaction, data }: UpdateTransactionOptions) =>
      financialsApi.updateTransaction(transaction.id, data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Transaction updated",
        `${data.description} has been saved.`
      )
      return queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (error) => notifyError("Couldn't update the transaction", error),
  })
}
