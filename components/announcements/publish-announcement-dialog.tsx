"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Megaphone } from "lucide-react"
import { useForm } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePublishAnnouncement } from "@/hooks/use-publish-announcement"
import {
  announcementBodyMaxLength,
  announcementTitleMaxLength,
  publishAnnouncementSchema,
} from "@/lib/schemas/announcements"
import type { PublishAnnouncementFormValues } from "@/lib/types/announcements"

const defaultValues: PublishAnnouncementFormValues = { title: "", body: "" }

export function PublishAnnouncementDialog() {
  const [open, setOpen] = useState(false)
  const publishAnnouncement = usePublishAnnouncement()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublishAnnouncementFormValues>({
    resolver: zodResolver(publishAnnouncementSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (publishAnnouncement.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      publishAnnouncement.reset()
    }
  }

  function onSubmit(data: PublishAnnouncementFormValues) {
    publishAnnouncement.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Megaphone aria-hidden="true" />
          Publish announcement
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Publish an announcement
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Everyone in the company will see it. It&apos;s dated when you
            publish it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {publishAnnouncement.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t publish the announcement. Try again.
            </p>
          )}

          <div className="flex flex-col gap-5">
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="announcement-title">Title</FieldLabel>
              <Input
                id="announcement-title"
                autoComplete="off"
                placeholder="e.g. Public holiday on 15 November"
                maxLength={announcementTitleMaxLength}
                aria-invalid={!!errors.title}
                className={authInputClassName}
                {...register("title")}
              />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.body}>
              <FieldLabel htmlFor="announcement-body">Announcement</FieldLabel>
              <Textarea
                id="announcement-body"
                placeholder="What does the team need to know?"
                maxLength={announcementBodyMaxLength}
                aria-invalid={!!errors.body}
                className="max-h-72 min-h-32 rounded-xl bg-background/60 px-3.5 py-2.5"
                {...register("body")}
              />
              <FieldError>{errors.body?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={publishAnnouncement.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={publishAnnouncement.isPending}
              className="h-10 rounded-full px-5"
            >
              {publishAnnouncement.isPending ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
