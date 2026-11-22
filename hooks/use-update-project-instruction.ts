import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectInstructionsQueryKey } from "@/hooks/use-project-instructions"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  ProjectInstruction,
  ProjectInstructionFormValues,
} from "@/lib/types/projects"

interface UpdateProjectInstructionOptions {
  instruction: Pick<ProjectInstruction, "id" | "projectId" | "status">
  data: ProjectInstructionFormValues
}

/** Saves changes to a project instruction. */
export function useUpdateProjectInstruction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ instruction, data }: UpdateProjectInstructionOptions) =>
      projectsApi.updateProjectInstruction(instruction, data),
    onSuccess: (_, { instruction, data }) => {
      notifySuccess(
        "Instruction updated",
        `The ${data.discipline} instruction has been saved.`
      )
      return queryClient.invalidateQueries({
        queryKey: projectInstructionsQueryKey(instruction.projectId),
      })
    },
    onError: (error) => notifyError("Couldn't update the instruction", error),
  })
}
