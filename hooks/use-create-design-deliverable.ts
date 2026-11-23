import { useMutation, useQueryClient } from "@tanstack/react-query"

import { designDeliverablesQueryKey } from "@/hooks/use-design-deliverables"
import * as designApi from "@/lib/api/design"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { DesignDeliverableFormValues } from "@/lib/types/design"

interface CreateDesignDeliverableOptions {
  data: DesignDeliverableFormValues
}

/** Adds a design deliverable. Client approval starts as pending. */
export function useCreateDesignDeliverable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateDesignDeliverableOptions) =>
      designApi.createDesignDeliverable(data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Deliverable added",
        `${data.deliverable} is now being tracked.`
      )
      return queryClient.invalidateQueries({
        queryKey: designDeliverablesQueryKey(data.projectId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.deliverable}`, error),
  })
}
