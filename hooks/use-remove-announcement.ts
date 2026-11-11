import { useMutation, useQueryClient } from "@tanstack/react-query"

import { announcementsQueryKey } from "@/hooks/use-announcements"
import * as announcementsApi from "@/lib/mock/announcements"

interface RemoveAnnouncementOptions {
  id: string
}

/** Removes an announcement for everyone. */
export function useRemoveAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: RemoveAnnouncementOptions) =>
      announcementsApi.removeAnnouncement(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: announcementsQueryKey }),
  })
}
