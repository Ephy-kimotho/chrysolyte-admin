import { useQuery } from "@tanstack/react-query"

import * as announcementsApi from "@/lib/api/announcements"

export const announcementsQueryKey = ["announcements"] as const

type UseAnnouncementsOptions = {
  /** False skips the request, e.g. for a user who can't see announcements. */
  enabled?: boolean
}

/** Lists company announcements, newest first. */
export function useAnnouncements({
  enabled = true,
}: UseAnnouncementsOptions = {}) {
  return useQuery({
    queryKey: announcementsQueryKey,
    queryFn: announcementsApi.listAnnouncements,
    enabled,
  })
}
