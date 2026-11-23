import { z } from "zod"

export const announcementTitleMaxLength = 120
export const announcementMessageMaxLength = 2000

export const publishAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a title")
    .max(
      announcementTitleMaxLength,
      `Keep the title under ${announcementTitleMaxLength} characters`
    ),
  message: z
    .string()
    .trim()
    .min(1, "Write the announcement")
    .max(
      announcementMessageMaxLength,
      `Keep the announcement under ${announcementMessageMaxLength} characters`
    ),
  /** Unticked keeps the announcement internal. */
  isPublic: z.boolean(),
})
