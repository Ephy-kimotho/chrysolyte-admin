"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { DesignDeliverableFormFields } from "@/components/design/design-deliverable-form-fields"
import { tableCardActionClassName } from "@/components/table-card"
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
import { useCreateDesignDeliverable } from "@/hooks/use-create-design-deliverable"
import { getErrorMessage } from "@/lib/api/errors"
import { designDeliverableSchema } from "@/lib/schemas/design"
import type { DesignDeliverableFormValues } from "@/lib/types/design"

// The project starts on the one being viewed; the rest must be chosen.
function getDefaultValues(
  projectId: string
): DefaultValues<DesignDeliverableFormValues> {
  return {
    projectId,
    deliverable: "",
    leadId: "",
    reviewerId: "",
    deadline: "",
    progress: 0,
    // Not shown when adding: the client reviews it later.
    clientApproved: false,
  }
}

export function AddDeliverableDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const createDeliverable = useCreateDesignDeliverable()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DesignDeliverableFormValues>({
    resolver: zodResolver(designDeliverableSchema),
    defaultValues: getDefaultValues(projectId),
  })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createDeliverable.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues(projectId))
      createDeliverable.reset()
    }
  }

  function onSubmit(data: DesignDeliverableFormValues) {
    createDeliverable.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={tableCardActionClassName}>
          <Plus aria-hidden="true" />
          Deliverable
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a deliverable
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Client approval starts as pending until the client reviews it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createDeliverable.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createDeliverable.error,
                "We couldn't add the deliverable. Try again."
              )}
            </p>
          )}

          <DesignDeliverableFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="add-deliverable"
            variant="create"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createDeliverable.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createDeliverable.isPending}
              className="h-10 rounded-full px-5"
            >
              {createDeliverable.isPending ? "Adding…" : "Add deliverable"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
