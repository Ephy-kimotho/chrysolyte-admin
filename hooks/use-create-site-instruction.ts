import { useMutation, useQueryClient } from "@tanstack/react-query"

import { siteInstructionsQueryKey } from "@/hooks/use-site-instructions"
import * as consultantsApi from "@/lib/mock/consultants"
import type { CreateSiteInstructionFormValues } from "@/lib/types/consultants"

interface CreateSiteInstructionOptions {
  data: CreateSiteInstructionFormValues
}

/** Records a consultant's site instruction. New instructions start open. */
export function useCreateSiteInstruction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateSiteInstructionOptions) =>
      consultantsApi.createSiteInstruction(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: siteInstructionsQueryKey }),
  })
}
