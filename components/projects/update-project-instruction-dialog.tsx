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
import { createProjectInstructionSchema } from "@/lib/schemas/projects"
import {
  instructionDisciplines,
  type CreateProjectInstructionFormValues,
  type InstructionDiscipline,
  type ProjectInstruction,
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update instruction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for this instruction.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the instruction's current details. */}
        <UpdateProjectInstructionForm
          instruction={instruction}
          onUpdated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/** Null when the API sends a discipline the select doesn't offer. */
function toKnownDiscipline(discipline: string) {
  return instructionDisciplines.includes(discipline as InstructionDiscipline)
    ? (discipline as InstructionDiscipline)
    : undefined
}

function UpdateProjectInstructionForm({
  instruction,
  onUpdated,
}: {
  instruction: ProjectInstruction
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectInstructionFormValues>({
    resolver: zodResolver(createProjectInstructionSchema),
    defaultValues: {
      issueDate: instruction.issueDate,
      discipline: toKnownDiscipline(instruction.discipline),
      instruction: instruction.instruction,
      responsibleId: instruction.responsibleId,
      deadline: instruction.deadline,
    },
  })

  // TODO: save through a useUpdateProjectInstruction hook once the API is ready.
  function onSubmit() {
    onUpdated()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ProjectInstructionFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-instruction-${instruction.id}`}
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="h-10 rounded-full px-5">
          Save changes
        </Button>
      </div>
    </form>
  )
}
