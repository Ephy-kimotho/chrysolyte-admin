import { z } from "zod"

export const announcementTitleMaxLength = 120
export const announcementBodyMaxLength = 2000

export const publishAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a title")
    .max(
      announcementTitleMaxLength,
      `Keep the title under ${announcementTitleMaxLength} characters`
    ),
  body: z
    .string()
    .trim()
    .min(1, "Write the announcement")
    .max(
      announcementBodyMaxLength,
      `Keep the announcement under ${announcementBodyMaxLength} characters`
    ),
})
