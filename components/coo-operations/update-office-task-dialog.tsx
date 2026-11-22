"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { OfficeTaskFormFields } from "@/components/coo-operations/office-task-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateOfficeTask } from "@/hooks/use-update-office-task"
import { getErrorMessage } from "@/lib/api/errors"
import { createOfficeTaskSchema } from "@/lib/schemas/coo-operations"
import {
  officeTaskCategories,
  type CreateOfficeTaskFormValues,
  type OfficeTask,
  type OfficeTaskCategory,
} from "@/lib/types/coo-operations"

type UpdateOfficeTaskDialogProps = {
  task: OfficeTask
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateOfficeTaskDialog({
  task,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateOfficeTaskDialogProps) {
  const updateOfficeTask = useUpdateOfficeTask()

  function handleOpenChange(nextOpen: boolean) {
    if (updateOfficeTask.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateOfficeTask.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update office task
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {task.task}.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the task's current details. */}
        <UpdateOfficeTaskForm
          task={task}
          updateOfficeTask={updateOfficeTask}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/** Undefined when the API sends a category the select doesn't offer. */
function toKnownCategory(category: string) {
  return officeTaskCategories.includes(category as OfficeTaskCategory)
    ? (category as OfficeTaskCategory)
    : undefined
}

function UpdateOfficeTaskForm({
  task,
  updateOfficeTask,
  onUpdated,
}: {
  task: OfficeTask
  updateOfficeTask: ReturnType<typeof useUpdateOfficeTask>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOfficeTaskFormValues>({
    resolver: zodResolver(createOfficeTaskSchema),
    defaultValues: {
      projectId: task.projectId,
      category: toKnownCategory(task.category),
      task: task.task,
      owner: task.owner,
      deadline: task.deadline,
      progress: task.progress,
      notes: task.notes ?? "",
    },
  })

  function onSubmit(data: CreateOfficeTaskFormValues) {
    updateOfficeTask.mutate({ task, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateOfficeTask.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateOfficeTask.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <OfficeTaskFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-office-task-${task.id}`}
        projectReadOnly
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateOfficeTask.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateOfficeTask.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateOfficeTask.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
