import { isValid, parseISO } from "date-fns"

import { axiosInstance } from "@/lib/axios"
import type {
  Announcement,
  AnnouncementResponse,
  PublishAnnouncementFormValues,
  PublishAnnouncementPayload,
} from "@/lib/types/announcements"

const announcementsPath = "/firmcontrol/announcements"

/** `2026-11-23 08:25:21.379201+00:00` → `2026-11-23T08:25:21.379Z`. */
function toIsoDateTime(timestamp: string) {
  const date = parseISO(timestamp)
  return isValid(date) ? date.toISOString() : timestamp
}

function toAnnouncement(announcement: AnnouncementResponse): Announcement {
  return {
    id: announcement.announcement_id,
    title: announcement.title,
    message: announcement.message,
    authorId: announcement.author_id,
    authorName: announcement.author_name,
    isPublic: announcement.is_public,
    publishedAt: toIsoDateTime(announcement.created_at),
  }
}

/** Company announcements, newest first. */
export async function listAnnouncements() {
  const response =
    await axiosInstance.get<AnnouncementResponse[]>(announcementsPath)
  return response.data
    .map(toAnnouncement)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Publishes an announcement. The API records the author and the date. */
export async function publishAnnouncement(
  values: PublishAnnouncementFormValues
) {
  const payload: PublishAnnouncementPayload = {
    title: values.title,
    message: values.message,
    is_public: values.isPublic,
  }

  const response = await axiosInstance.post(announcementsPath, payload)
  return response.data
}

/** Removes an announcement for everyone. */
export async function removeAnnouncement(announcementId: string) {
  await axiosInstance.delete(
    `${announcementsPath}/${encodeURIComponent(announcementId)}`
  )
}
