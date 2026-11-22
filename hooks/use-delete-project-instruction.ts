import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectInstructionsQueryKey } from "@/hooks/use-project-instructions"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ProjectInstruction } from "@/lib/types/projects"

interface DeleteProjectInstructionOptions {
  instruction: Pick<ProjectInstruction, "id" | "projectId" | "discipline">
}

/** Deletes an instruction from a project. */
export function useDeleteProjectInstruction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ instruction }: DeleteProjectInstructionOptions) =>
      projectsApi.deleteProjectInstruction(instruction.id),
    onSuccess: (_, { instruction }) => {
      notifySuccess(
        "Instruction deleted",
        `The ${instruction.discipline} instruction has been removed.`
      )
      return queryClient.invalidateQueries({
        queryKey: projectInstructionsQueryKey(instruction.projectId),
      })
    },
    onError: (error) => notifyError("Couldn't delete the instruction", error),
  })
}
