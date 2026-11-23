"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { DesignDeliverableFormFields } from "@/components/design/design-deliverable-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateDesignDeliverable } from "@/hooks/use-update-design-deliverable"
import { getErrorMessage } from "@/lib/api/errors"
import { designDeliverableSchema } from "@/lib/schemas/design"
import {
  designStages,
  type DesignDeliverable,
  type DesignDeliverableFormValues,
  type DesignStage,
} from "@/lib/types/design"
import {
  instructionDisciplines,
  type InstructionDiscipline,
} from "@/lib/types/projects"

type UpdateDeliverableDialogProps = {
  deliverable: DesignDeliverable
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateDeliverableDialog({
  deliverable,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateDeliverableDialogProps) {
  const updateDeliverable = useUpdateDesignDeliverable()

  function handleOpenChange(nextOpen: boolean) {
    if (updateDeliverable.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateDeliverable.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update deliverable
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {deliverable.deliverable}.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the deliverable's current details. */}
        <UpdateDeliverableForm
          deliverable={deliverable}
          updateDeliverable={updateDeliverable}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/** Undefined when the API sends a value the select doesn't offer. */
function toKnown<T extends string>(known: readonly T[], value: string) {
  return known.includes(value as T) ? (value as T) : undefined
}

function UpdateDeliverableForm({
  deliverable,
  updateDeliverable,
  onUpdated,
}: {
  deliverable: DesignDeliverable
  updateDeliverable: ReturnType<typeof useUpdateDesignDeliverable>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DesignDeliverableFormValues>({
    resolver: zodResolver(designDeliverableSchema),
    defaultValues: {
      projectId: deliverable.projectId,
      discipline: toKnown<InstructionDiscipline>(
        instructionDisciplines,
        deliverable.discipline
      ),
      stage: toKnown<DesignStage>(designStages, deliverable.stage),
      deliverable: deliverable.deliverable,
      leadId: deliverable.leadId,
      reviewerId: deliverable.reviewerId,
      deadline: deliverable.deadline,
      progress: deliverable.progress,
      clientApproved: deliverable.clientApproval === "Approved",
    },
  })

  function onSubmit(data: DesignDeliverableFormValues) {
    updateDeliverable.mutate({ deliverable, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateDeliverable.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateDeliverable.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <DesignDeliverableFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-deliverable-${deliverable.id}`}
        variant="update"
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateDeliverable.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateDeliverable.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateDeliverable.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
