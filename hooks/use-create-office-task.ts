import { useMutation, useQueryClient } from "@tanstack/react-query"

import { officeTasksQueryKey } from "@/hooks/use-office-tasks"
import * as cooOperationsApi from "@/lib/api/coo-operations"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateOfficeTaskFormValues } from "@/lib/types/coo-operations"

interface CreateOfficeTaskOptions {
  data: CreateOfficeTaskFormValues
}

/** Adds a task to the office work log. */
export function useCreateOfficeTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateOfficeTaskOptions) =>
      cooOperationsApi.createOfficeTask(data),
    onSuccess: (_, { data }) => {
      notifySuccess("Task added", `${data.task} is now in the office work log.`)
      return queryClient.invalidateQueries({ queryKey: officeTasksQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.task}`, error),
  })
}
