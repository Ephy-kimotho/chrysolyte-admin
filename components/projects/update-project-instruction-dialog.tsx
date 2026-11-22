"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ProjectInstructionFormFields } from "@/components/projects/project-instruction-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateProjectInstruction } from "@/hooks/use-update-project-instruction"
import { getErrorMessage } from "@/lib/api/errors"
import { updateProjectInstructionSchema } from "@/lib/schemas/projects"
import {
  instructionDisciplines,
  type InstructionDiscipline,
  type ProjectInstruction,
  type ProjectInstructionFormValues,
} from "@/lib/types/projects"

type UpdateProjectInstructionDialogProps = {
  instruction: ProjectInstruction
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateProjectInstructionDialog({
  instruction,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateProjectInstructionDialogProps) {
  const updateInstruction = useUpdateProjectInstruction()

  function handleOpenChange(nextOpen: boolean) {
    if (updateInstruction.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateInstruction.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update instruction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record, or add a response to it.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the instruction's current details. */}
        <UpdateProjectInstructionForm
          instruction={instruction}
          updateInstruction={updateInstruction}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/** Undefined when the API sends a discipline the select doesn't offer. */
function toKnownDiscipline(discipline: string) {
  return instructionDisciplines.includes(discipline as InstructionDiscipline)
    ? (discipline as InstructionDiscipline)
    : undefined
}

function UpdateProjectInstructionForm({
  instruction,
  updateInstruction,
  onUpdated,
}: {
  instruction: ProjectInstruction
  updateInstruction: ReturnType<typeof useUpdateProjectInstruction>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInstructionFormValues>({
    resolver: zodResolver(updateProjectInstructionSchema),
    defaultValues: {
      // Not editable, but it keeps the deadline from going before it.
      issueDate: instruction.issueDate,
      discipline: toKnownDiscipline(instruction.discipline),
      instruction: instruction.instruction,
      responsibleId: instruction.responsibleId,
      deadline: instruction.deadline,
      response: instruction.response ?? "",
    },
  })

  function onSubmit(data: ProjectInstructionFormValues) {
    updateInstruction.mutate({ instruction, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateInstruction.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateInstruction.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <ProjectInstructionFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-instruction-${instruction.id}`}
        variant="update"
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateInstruction.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateInstruction.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateInstruction.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
