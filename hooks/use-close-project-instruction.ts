import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectInstructionsQueryKey } from "@/hooks/use-project-instructions"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ProjectInstruction } from "@/lib/types/projects"

interface CloseProjectInstructionOptions {
  instruction: Pick<ProjectInstruction, "id" | "projectId" | "discipline">
}

/** Marks a project instruction as carried out. */
export function useCloseProjectInstruction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ instruction }: CloseProjectInstructionOptions) =>
      projectsApi.closeProjectInstruction(instruction.id),
    onSuccess: (_, { instruction }) => {
      notifySuccess(
        "Instruction closed",
        `The ${instruction.discipline} instruction is no longer open.`
      )
      return queryClient.invalidateQueries({
        queryKey: projectInstructionsQueryKey(instruction.projectId),
      })
    },
    onError: (error) => notifyError("Couldn't close the instruction", error),
  })
}
