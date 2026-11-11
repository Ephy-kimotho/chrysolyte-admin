import type { z } from "zod"

import type { publishAnnouncementSchema } from "@/lib/schemas/announcements"

export type Announcement = {
  id: string
  title: string
  body: string
  /** Name of the person who published it. */
  author: string
  /** ISO date-time, set when the announcement is published. */
  publishedAt: string
}

export type PublishAnnouncementFormValues = z.infer<
  typeof publishAnnouncementSchema
>
