"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useUploadStaffPhoto } from "@/hooks/use-upload-staff-photo"
import { getErrorMessage } from "@/lib/api/errors"
import { uploadStaffPhotoSchema } from "@/lib/schemas/staff"
import type {
  UploadStaffPhotoFormInput,
  UploadStaffPhotoFormValues,
} from "@/lib/types/staff"
import { cn } from "@/lib/utils"

/** A small round button that sits on the corner of a profile photo. */
export const photoActionClassName =
  "absolute right-0 bottom-0 size-8 rounded-full border-2 border-card bg-background shadow-sm"

const defaultValues: UploadStaffPhotoFormInput = { photo: null }

type UploadStaffPhotoDialogProps = {
  staffId: string
  staffName: string
}

export function UploadStaffPhotoDialog({
  staffId,
  staffName,
}: UploadStaffPhotoDialogProps) {
  const [open, setOpen] = useState(false)
  const uploadPhoto = useUploadStaffPhoto()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadStaffPhotoFormInput, unknown, UploadStaffPhotoFormValues>({
    resolver: zodResolver(uploadStaffPhotoSchema),
    defaultValues,
  })

  // Every opening starts with no photo chosen and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (uploadPhoto.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      uploadPhoto.reset()
    }
  }

  function onSubmit(data: UploadStaffPhotoFormValues) {
    uploadPhoto.mutate(
      { staffId, name: staffName, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Upload a photo of ${staffName}`}
          className={cn(photoActionClassName, "text-muted-foreground")}
        >
          <Camera aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Upload a profile photo
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            It shows on {staffName}&apos;s profile and in the staff list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {uploadPhoto.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                uploadPhoto.error,
                "We couldn't upload the photo. Try again."
              )}
            </p>
          )}

          <Field data-invalid={!!errors.photo}>
            <FieldLabel htmlFor="staff-photo-upload" className="sr-only">
              Profile photo
            </FieldLabel>
            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <ImageUpload
                  id="staff-photo-upload"
                  ref={field.ref}
                  shape="circle"
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

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={uploadPhoto.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={uploadPhoto.isPending}
              className="h-10 rounded-full px-5"
            >
              {uploadPhoto.isPending ? "Uploading…" : "Upload photo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
