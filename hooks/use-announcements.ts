import { useQuery } from "@tanstack/react-query"

import * as announcementsApi from "@/lib/mock/announcements"

export const announcementsQueryKey = ["announcements"] as const

/** Lists company announcements, newest first. */
export function useAnnouncements() {
  return useQuery({
    queryKey: announcementsQueryKey,
    queryFn: announcementsApi.listAnnouncements,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: announcementsApi.getAnnouncementsSnapshot,
  })
}
