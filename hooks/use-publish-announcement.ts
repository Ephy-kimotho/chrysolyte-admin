import { useMutation, useQueryClient } from "@tanstack/react-query"

import { announcementsQueryKey } from "@/hooks/use-announcements"
import * as announcementsApi from "@/lib/mock/announcements"
import type { PublishAnnouncementFormValues } from "@/lib/types/announcements"
import { useAuth } from "@/providers/auth-provider"

interface PublishAnnouncementOptions {
  data: PublishAnnouncementFormValues
}

/** Publishes an announcement to everyone, dated now. */
export function usePublishAnnouncement() {
  const queryClient = useQueryClient()
  // The real API will take the author from the session; the mock needs it passed.
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ data }: PublishAnnouncementOptions) =>
      announcementsApi.publishAnnouncement(data, user?.full_name ?? "Admin"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: announcementsQueryKey }),
  })
}
