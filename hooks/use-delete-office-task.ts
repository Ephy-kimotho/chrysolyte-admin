import { useMutation, useQueryClient } from "@tanstack/react-query"

import { officeTasksQueryKey } from "@/hooks/use-office-tasks"
import * as cooOperationsApi from "@/lib/api/coo-operations"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { OfficeTask } from "@/lib/types/coo-operations"

interface DeleteOfficeTaskOptions {
  task: Pick<OfficeTask, "id" | "task">
}

/** Deletes a task from the office work log. */
export function useDeleteOfficeTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ task }: DeleteOfficeTaskOptions) =>
      cooOperationsApi.deleteOfficeTask(task.id),
    onSuccess: (_, { task }) => {
      notifySuccess(
        "Task deleted",
        `${task.task} is no longer in the office work log.`
      )
      return queryClient.invalidateQueries({ queryKey: officeTasksQueryKey })
    },
    onError: (error, { task }) =>
      notifyError(`Couldn't delete ${task.task}`, error),
  })
}
