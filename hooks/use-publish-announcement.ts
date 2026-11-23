import { useMutation, useQueryClient } from "@tanstack/react-query"

import { announcementsQueryKey } from "@/hooks/use-announcements"
import * as announcementsApi from "@/lib/api/announcements"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { PublishAnnouncementFormValues } from "@/lib/types/announcements"

interface PublishAnnouncementOptions {
  data: PublishAnnouncementFormValues
}

/** Publishes an announcement, dated now. */
export function usePublishAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: PublishAnnouncementOptions) =>
      announcementsApi.publishAnnouncement(data),
    onSuccess: (_, { data }) => {
      notifySuccess("Announcement published", data.title)
      return queryClient.invalidateQueries({ queryKey: announcementsQueryKey })
    },
    onError: (error) => notifyError("Couldn't publish the announcement", error),
  })
}
