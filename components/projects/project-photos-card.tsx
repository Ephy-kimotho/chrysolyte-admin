"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { ImageUpload } from "@/components/image-upload"
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { useAddProjectPhotos } from "@/hooks/use-add-project-photos"
import {
  addProjectPhotosSchema,
  maxProjectPhotos,
} from "@/lib/schemas/projects"
import type { AddProjectPhotosFormValues, Project } from "@/lib/types/projects"

const defaultValues: AddProjectPhotosFormValues = { photos: [] }

type ProjectPhotosCardProps = {
  project: Pick<Project, "id" | "name" | "photoUrls">
}

export function ProjectPhotosCard({ project }: ProjectPhotosCardProps) {
  const hasPhotos = project.photoUrls.length > 0
  const remaining = maxProjectPhotos - project.photoUrls.length
  // With no photos the uploader shows straight away; otherwise on request.
  const [isAdding, setIsAdding] = useState(false)
  const showUploader = (!hasPhotos || isAdding) && remaining > 0

  const addPhotos = useAddProjectPhotos()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProjectPhotosFormValues>({
    resolver: zodResolver(addProjectPhotosSchema),
    defaultValues,
  })

  function closeUploader() {
    reset(defaultValues)
    addPhotos.reset()
    setIsAdding(false)
  }

  function onSubmit(data: AddProjectPhotosFormValues) {
    addPhotos.mutate({ id: project.id, data }, { onSuccess: closeUploader })
  }

  return (
    <TableCard
      titleId="project-photos-heading"
      title="Photo"
      titleClassName="pt-2 text-lg"
      action={
        hasPhotos &&
        !isAdding &&
        remaining > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="mt-2 h-9 rounded-xl px-3"
          >
            <Plus aria-hidden="true" />
            Add photos
          </Button>
        )
      }
    >
      {hasPhotos && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3">
          {project.photoUrls.map((url, index) => (
            <li
              key={url}
              className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={url}
                alt={`${project.name} site photo ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      {showUploader && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3"
        >
          {addPhotos.isError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t upload the photos. Try again.
            </p>
          )}

          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <ImageUpload
                multiple
                id="project-photos"
                ref={field.ref}
                maxFiles={remaining}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={addPhotos.isPending}
                aria-invalid={!!errors.photos}
              />
            )}
          />
          <FieldError>{errors.photos?.message}</FieldError>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {hasPhotos && (
              <Button
                type="button"
                variant="outline"
                onClick={closeUploader}
                disabled={addPhotos.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={addPhotos.isPending}
              className="h-10 rounded-full px-5"
            >
              {addPhotos.isPending ? "Uploading…" : "Upload photos"}
            </Button>
          </div>
        </form>
      )}
    </TableCard>
  )
}
