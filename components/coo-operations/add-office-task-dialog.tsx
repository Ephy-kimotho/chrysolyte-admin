"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateOfficeTask } from "@/hooks/use-create-office-task"
import { createOfficeTaskSchema } from "@/lib/schemas/coo-operations"
import {
  officeTaskCategories,
  type CreateOfficeTaskFormValues,
} from "@/lib/types/coo-operations"

// No category is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateOfficeTaskFormValues> = {
  task: "",
  owner: "",
  deadline: "",
  progress: 0,
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
            The task is marked overdue if it isn&apos;t complete by its
            deadline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createOfficeTask.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the task. Try again.
            </p>
          )}

          <div className="flex flex-col gap-5">
            <Field data-invalid={!!errors.task}>
              <FieldLabel htmlFor="office-task-task">Task</FieldLabel>
              <Input
                id="office-task-task"
                autoComplete="off"
                placeholder="e.g. Prepare weekly project cost report"
                aria-invalid={!!errors.task}
                className={authInputClassName}
                {...register("task")}
              />
              <FieldError>{errors.task?.message}</FieldError>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.category}>
                <FieldLabel htmlFor="office-task-category">Category</FieldLabel>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      // "" shows the placeholder again after the form resets.
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="office-task-category"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-invalid={!!errors.category}
                        className="h-11! w-full rounded-xl bg-background/60 px-3.5"
                      >
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {officeTaskCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.category?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.owner}>
                <FieldLabel htmlFor="office-task-owner">Owner</FieldLabel>
                <Input
                  id="office-task-owner"
                  autoComplete="off"
                  placeholder="e.g. Anne Wambui"
                  aria-invalid={!!errors.owner}
                  className={authInputClassName}
                  {...register("owner")}
                />
                <FieldError>{errors.owner?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.deadline}>
                <FieldLabel htmlFor="office-task-deadline">Deadline</FieldLabel>
                <Controller
                  control={control}
                  name="deadline"
                  render={({ field }) => (
                    <DatePicker
                      id="office-task-deadline"
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Choose the deadline"
                      aria-invalid={!!errors.deadline}
                    />
                  )}
                />
                <FieldError>{errors.deadline?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.progress}>
                <FieldLabel htmlFor="office-task-progress">
                  Progress (%)
                </FieldLabel>
                <Input
                  id="office-task-progress"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  aria-invalid={!!errors.progress}
                  className={authInputClassName}
                  {...register("progress", { valueAsNumber: true })}
                />
                <FieldError>{errors.progress?.message}</FieldError>
              </Field>
            </div>
          </div>

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
