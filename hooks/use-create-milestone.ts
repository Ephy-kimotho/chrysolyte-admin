import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeQueryKey } from "@/hooks/use-project-programme"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as programmeApi from "@/lib/mock/programme"
import type { CreateMilestoneFormValues } from "@/lib/types/programme"

interface CreateMilestoneOptions {
  projectId: string
  data: CreateMilestoneFormValues
}

/** Adds a milestone to a project. Project progress updates to match. */
export function useCreateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateMilestoneOptions) =>
      programmeApi.createMilestone(projectId, data),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: programmeQueryKey }),
        queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
      ]),
  })
}
