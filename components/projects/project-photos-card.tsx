"use client"

import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { DeleteProjectPhotoDialog } from "@/components/projects/delete-project-photo-dialog"
import { ImageUpload } from "@/components/image-upload"
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useUploadProjectPhoto } from "@/hooks/use-upload-project-photo"
import { getErrorMessage } from "@/lib/api/errors"
import { uploadProjectPhotoSchema } from "@/lib/schemas/projects"
import type {
  Project,
  UploadProjectPhotoFormInput,
  UploadProjectPhotoFormValues,
} from "@/lib/types/projects"

const defaultValues: UploadProjectPhotoFormInput = { photo: null }

type ProjectPhotosCardProps = {
  project: Pick<Project, "id" | "name" | "coverImageUrl">
}

/** The project's photo, filling the card, or a picker to upload one. */
export function ProjectPhotosCard({ project }: ProjectPhotosCardProps) {
  if (!project.coverImageUrl)
    return <UploadProjectPhotoCard project={project} />

  return (
    <section
      aria-labelledby="project-photo-heading"
      className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10"
    >
      <h2 id="project-photo-heading" className="sr-only">
        Photo
      </h2>
      <Image
        src={project.coverImageUrl}
        alt={`Photo of ${project.name}`}
        fill
        unoptimized
        className="object-cover"
      />
      <DeleteProjectPhotoDialog
        projectId={project.id}
        projectName={project.name}
        className="absolute top-3 right-3"
      />
    </section>
  )
}

function UploadProjectPhotoCard({ project }: ProjectPhotosCardProps) {
  const uploadPhoto = useUploadProjectPhoto()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<
    UploadProjectPhotoFormInput,
    unknown,
    UploadProjectPhotoFormValues
  >({
    resolver: zodResolver(uploadProjectPhotoSchema),
    defaultValues,
  })

  // Once the upload lands, the photo replaces this card, so a later delete
  // brings back a fresh, empty picker.
  function onSubmit(data: UploadProjectPhotoFormValues) {
    uploadPhoto.mutate({ projectId: project.id, name: project.name, data })
  }

  return (
    <TableCard
      titleId="project-photo-heading"
      title="Photo"
      titleClassName="pt-2 text-lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        {uploadPhoto.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              uploadPhoto.error,
              "We couldn't upload the photo. Try again."
            )}
          </p>
        )}

        <Field data-invalid={!!errors.photo}>
          <FieldLabel htmlFor="project-photo-upload" className="sr-only">
            Project photo
          </FieldLabel>
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <ImageUpload
                id="project-photo-upload"
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={uploadPhoto.isPending}
                aria-invalid={!!errors.photo}
              />
            )}
          />
          <FieldError>{errors.photo?.message}</FieldError>
        </Field>

        <Button
          type="submit"
          disabled={uploadPhoto.isPending}
          className="h-10 rounded-full px-5 sm:self-end"
        >
          {uploadPhoto.isPending ? "Uploading…" : "Upload photo"}
        </Button>
      </form>
    </TableCard>
  )
}
