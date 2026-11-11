import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeQueryKey } from "@/hooks/use-project-programme"
import * as programmeApi from "@/lib/mock/programme"
import type { CreateProgrammeActivityFormValues } from "@/lib/types/programme"

interface CreateProgrammeActivityOptions {
  projectId: string
  data: CreateProgrammeActivityFormValues
}

/** Adds an activity to a project's work programme. */
export function useCreateProgrammeActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateProgrammeActivityOptions) =>
      programmeApi.createProgrammeActivity(projectId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: programmeQueryKey }),
  })
}
