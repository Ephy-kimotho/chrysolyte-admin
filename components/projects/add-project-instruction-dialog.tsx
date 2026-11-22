"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { ProjectInstructionFormFields } from "@/components/projects/project-instruction-form-fields"
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
import { useCreateProjectInstruction } from "@/hooks/use-create-project-instruction"
import { getErrorMessage } from "@/lib/api/errors"
import { createProjectInstructionSchema } from "@/lib/schemas/projects"
import type { CreateProjectInstructionFormValues } from "@/lib/types/projects"

// The date starts on today, the usual case; everything else must be filled in.
function getDefaultValues(): DefaultValues<CreateProjectInstructionFormValues> {
  return {
    issueDate: format(new Date(), "yyyy-MM-dd"),
    instruction: "",
    responsibleId: "",
    deadline: "",
  }
}

export function AddProjectInstructionDialog({
  projectId,
}: {
  projectId: string
}) {
  const [open, setOpen] = useState(false)
  const createInstruction = useCreateProjectInstruction()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInstructionFormValues>({
    resolver: zodResolver(createProjectInstructionSchema),
    defaultValues: getDefaultValues(),
  })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createInstruction.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues())
      createInstruction.reset()
    }
  }

  function onSubmit(data: CreateProjectInstructionFormValues) {
    createInstruction.mutate(
      { projectId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={tableCardActionClassName}>
          <Plus aria-hidden="true" />
          Instruction
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Record an instruction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            The instruction is tracked until it&apos;s carried out.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createInstruction.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createInstruction.error,
                "We couldn't record the instruction. Try again."
              )}
            </p>
          )}

          <ProjectInstructionFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="add-instruction"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createInstruction.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createInstruction.isPending}
              className="h-10 rounded-full px-5"
            >
              {createInstruction.isPending
                ? "Recording…"
                : "Record instruction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
