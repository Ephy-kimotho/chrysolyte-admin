import { useMutation, useQueryClient } from "@tanstack/react-query"

import { financialsQueryKey } from "@/hooks/use-financials"
import * as financialsApi from "@/lib/mock/financials"
import type { CreateTransactionFormValues } from "@/lib/types/financials"

interface CreateTransactionOptions {
  data: CreateTransactionFormValues
}

/** Records a client receipt or project cost against a project. */
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateTransactionOptions) =>
      financialsApi.createTransaction(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: financialsQueryKey }),
  })
}
