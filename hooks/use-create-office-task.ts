import { useMutation, useQueryClient } from "@tanstack/react-query"

import { officeTasksQueryKey } from "@/hooks/use-office-tasks"
import * as cooOperationsApi from "@/lib/mock/coo-operations"
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: officeTasksQueryKey }),
  })
}
