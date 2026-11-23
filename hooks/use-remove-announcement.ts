import { useMutation, useQueryClient } from "@tanstack/react-query"

import { announcementsQueryKey } from "@/hooks/use-announcements"
import * as announcementsApi from "@/lib/api/announcements"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { Announcement } from "@/lib/types/announcements"

interface RemoveAnnouncementOptions {
  announcement: Pick<Announcement, "id" | "title">
}

/** Removes an announcement for everyone. */
export function useRemoveAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ announcement }: RemoveAnnouncementOptions) =>
      announcementsApi.removeAnnouncement(announcement.id),
    onSuccess: (_, { announcement }) => {
      notifySuccess("Announcement removed", announcement.title)
      return queryClient.invalidateQueries({ queryKey: announcementsQueryKey })
    },
    onError: (error) => notifyError("Couldn't remove the announcement", error),
  })
}
