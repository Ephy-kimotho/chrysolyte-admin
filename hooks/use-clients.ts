import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as clientsApi from "@/lib/api/clients"

export const clientsQueryKey = ["clients"] as const

interface ClientsOptions {
  /** Filters clients on the server. Debounce it when it comes from typing. */
  search?: string
}

/** Lists clients, optionally filtered by a search term. */
export function useClients({ search = "" }: ClientsOptions = {}) {
  const term = search.trim()

  return useQuery({
    queryKey: [...clientsQueryKey, { search: term }],
    queryFn: () => clientsApi.listClients(term || undefined),
    // Keep showing the last results while a new search loads.
    placeholderData: keepPreviousData,
  })
}
