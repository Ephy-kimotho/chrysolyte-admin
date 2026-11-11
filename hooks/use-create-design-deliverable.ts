import { useMutation, useQueryClient } from "@tanstack/react-query"

import { designDeliverablesQueryKey } from "@/hooks/use-design-deliverables"
import * as designApi from "@/lib/mock/design"
import type { CreateDesignDeliverableFormValues } from "@/lib/types/design"

interface CreateDesignDeliverableOptions {
  data: CreateDesignDeliverableFormValues
}

/** Adds a design deliverable. Client approval starts as pending. */
export function useCreateDesignDeliverable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateDesignDeliverableOptions) =>
      designApi.createDesignDeliverable(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: designDeliverablesQueryKey }),
  })
}
