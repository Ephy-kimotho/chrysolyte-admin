import { useMutation, useQueryClient } from "@tanstack/react-query"

import { transactionsQueryKey } from "@/hooks/use-transactions"
import * as financialsApi from "@/lib/api/financials"
import { formatCurrency } from "@/lib/format"
import { notifyError, notifySuccess } from "@/lib/notify"
import {
  transactionTypeLabels,
  type CreateTransactionFormValues,
} from "@/lib/types/financials"

interface CreateTransactionOptions {
  data: CreateTransactionFormValues
}

/** Records a client receipt or project cost against a project. */
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateTransactionOptions) =>
      financialsApi.createTransaction(data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        `${transactionTypeLabels[data.type]} recorded`,
        `${formatCurrency(data.amount)} for ${data.description}.`
      )
      return queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (error) => notifyError("Couldn't record the transaction", error),
  })
}
