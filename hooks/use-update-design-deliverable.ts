import { useMutation, useQueryClient } from "@tanstack/react-query"

import { designDeliverablesQueryKey } from "@/hooks/use-design-deliverables"
import * as designApi from "@/lib/api/design"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  DesignDeliverable,
  DesignDeliverableFormValues,
} from "@/lib/types/design"

interface UpdateDesignDeliverableOptions {
  deliverable: Pick<DesignDeliverable, "id" | "status" | "clientApproval">
  data: DesignDeliverableFormValues
}

/** Saves changes to a design deliverable. */
export function useUpdateDesignDeliverable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ deliverable, data }: UpdateDesignDeliverableOptions) =>
      designApi.updateDesignDeliverable(deliverable, data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Deliverable updated",
        `${data.deliverable} has been saved.`
      )
      return queryClient.invalidateQueries({
        queryKey: designDeliverablesQueryKey(data.projectId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't update ${data.deliverable}`, error),
  })
}
