import { z } from "zod"

/** Image types the app accepts for uploads. */
export const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"]

export const maxImageSizeMb = 5

/** Short hint for upload fields, e.g. "JPG, PNG or WebP, up to 5 MB." */
export const imageUploadHint = `JPG, PNG or WebP, up to ${maxImageSizeMb} MB.`

// `File` doesn't exist during server rendering, so check for it before using it.
const fileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "Choose an image"
)

/** One image file: JPG, PNG or WebP, up to `maxImageSizeMb`. */
export const imageFileSchema = fileSchema
  .refine(
    (file) => acceptedImageTypes.includes(file.type),
    "Use a JPG, PNG or WebP image"
  )
  .refine(
    (file) => file.size <= maxImageSizeMb * 1024 * 1024,
    `Use an image under ${maxImageSizeMb} MB`
  )

/** A list of images, at most `max` of them. */
export function imageFilesSchema(max: number) {
  return z
    .array(imageFileSchema)
    .max(max, `Add up to ${max} ${max === 1 ? "image" : "images"}`)
}
