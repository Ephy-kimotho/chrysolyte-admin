import type { z } from "zod"

import type { publishAnnouncementSchema } from "@/lib/schemas/announcements"

export type Announcement = {
  id: string
  title: string
  message: string
  authorId: string
  /** Name of the person who published it, as the API sends it. */
  authorName: string
  /** False for an internal announcement. */
  isPublic: boolean
  /** ISO date-time, set when the announcement is published. */
  publishedAt: string
}

/** An announcement as `GET /firmcontrol/announcements` returns it. */
export type AnnouncementResponse = {
  announcement_id: string
  title: string
  message: string
  author_id: string
  author_name: string
  is_public: boolean
  /** Timestamp with offset, e.g. `2026-11-23 08:25:21.379201+00:00`. */
  created_at: string
}

export type PublishAnnouncementFormValues = z.infer<
  typeof publishAnnouncementSchema
>

/** Request body for `POST /firmcontrol/announcements`. */
export type PublishAnnouncementPayload = {
  title: string
  message: string
  is_public: boolean
}
