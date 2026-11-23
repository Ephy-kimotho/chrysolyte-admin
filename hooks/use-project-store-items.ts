import { useQuery } from "@tanstack/react-query"

import * as storesApi from "@/lib/api/stores"

export function projectStoreItemsQueryKey(projectId: string) {
  return ["project-store-items", projectId] as const
}

/** The items in a project's site store, low stock first. */
export function useProjectStoreItems(projectId: string) {
  return useQuery({
    queryKey: projectStoreItemsQueryKey(projectId),
    queryFn: () => storesApi.listProjectStoreItems(projectId),
  })
}
