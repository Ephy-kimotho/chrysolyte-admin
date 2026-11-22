import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectInstructionsQueryKey } from "@/hooks/use-project-instructions"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ProjectInstructionFormValues } from "@/lib/types/projects"

interface CreateProjectInstructionOptions {
  projectId: string
  data: ProjectInstructionFormValues
}

/** Records an instruction against a project. */
export function useCreateProjectInstruction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateProjectInstructionOptions) =>
      projectsApi.createProjectInstruction(projectId, data),
    onSuccess: (_, { projectId, data }) => {
      notifySuccess(
        "Instruction recorded",
        `The ${data.discipline} instruction is now being tracked.`
      )
      return queryClient.invalidateQueries({
        queryKey: projectInstructionsQueryKey(projectId),
      })
    },
    onError: (error) => notifyError("Couldn't record the instruction", error),
  })
}
