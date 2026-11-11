import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeQueryKey } from "@/hooks/use-project-programme"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as programmeApi from "@/lib/mock/programme"
import type { MilestoneProgressFormValues } from "@/lib/types/programme"

interface UpdateMilestoneProgressOptions {
  id: string
  data: MilestoneProgressFormValues
}

/** Sets a milestone's completion. Project progress updates to match. */
export function useUpdateMilestoneProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateMilestoneProgressOptions) =>
      programmeApi.updateMilestoneProgress(id, data.progress),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: programmeQueryKey }),
        queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
      ]),
  })
}
