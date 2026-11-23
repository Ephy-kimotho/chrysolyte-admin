import { useMutation, useQueryClient } from "@tanstack/react-query"

import { designDeliverablesQueryKey } from "@/hooks/use-design-deliverables"
import * as designApi from "@/lib/api/design"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { DesignDeliverable } from "@/lib/types/design"

interface DeleteDesignDeliverableOptions {
  deliverable: Pick<DesignDeliverable, "id" | "projectId" | "deliverable">
}

/** Deletes a design deliverable. */
export function useDeleteDesignDeliverable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ deliverable }: DeleteDesignDeliverableOptions) =>
      designApi.deleteDesignDeliverable(deliverable.id),
    onSuccess: (_, { deliverable }) => {
      notifySuccess(
        "Deliverable deleted",
        `${deliverable.deliverable} is no longer being tracked.`
      )
      return queryClient.invalidateQueries({
        queryKey: designDeliverablesQueryKey(deliverable.projectId),
      })
    },
    onError: (error, { deliverable }) =>
      notifyError(`Couldn't delete ${deliverable.deliverable}`, error),
  })
}
