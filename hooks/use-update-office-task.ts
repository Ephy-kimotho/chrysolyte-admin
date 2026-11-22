import { useMutation, useQueryClient } from "@tanstack/react-query"

import { officeTasksQueryKey } from "@/hooks/use-office-tasks"
import * as cooOperationsApi from "@/lib/api/coo-operations"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  CreateOfficeTaskFormValues,
  OfficeTask,
} from "@/lib/types/coo-operations"

interface UpdateOfficeTaskOptions {
  task: Pick<OfficeTask, "id" | "projectId" | "status">
  data: CreateOfficeTaskFormValues
}

/** Saves changes to an office task. */
export function useUpdateOfficeTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ task, data }: UpdateOfficeTaskOptions) =>
      cooOperationsApi.updateOfficeTask(task, data),
    onSuccess: (_, { data }) => {
      notifySuccess("Task updated", `${data.task} has been saved.`)
      return queryClient.invalidateQueries({ queryKey: officeTasksQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't update ${data.task}`, error),
  })
}
