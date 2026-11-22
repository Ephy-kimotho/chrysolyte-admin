"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { OfficeTaskFormFields } from "@/components/coo-operations/office-task-form-fields"
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
import { useCreateOfficeTask } from "@/hooks/use-create-office-task"
import { getErrorMessage } from "@/lib/api/errors"
import { createOfficeTaskSchema } from "@/lib/schemas/coo-operations"
import type { CreateOfficeTaskFormValues } from "@/lib/types/coo-operations"

// No category is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateOfficeTaskFormValues> = {
  projectId: "",
  task: "",
  owner: "",
  deadline: "",
  progress: 0,
  notes: "",
}

export function AddOfficeTaskDialog() {
  const [open, setOpen] = useState(false)
  const createOfficeTask = useCreateOfficeTask()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOfficeTaskFormValues>({
    resolver: zodResolver(createOfficeTaskSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createOfficeTask.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createOfficeTask.reset()
    }
  }

  function onSubmit(data: CreateOfficeTaskFormValues) {
    createOfficeTask.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Office task
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add an office task
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Track it against a project. It shows as overdue if it&apos;s still
            active after its deadline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createOfficeTask.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createOfficeTask.error,
                "We couldn't add the task. Try again."
              )}
            </p>
          )}

          <OfficeTaskFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="add-office-task"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createOfficeTask.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createOfficeTask.isPending}
              className="h-10 rounded-full px-5"
            >
              {createOfficeTask.isPending ? "Adding…" : "Add task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
