"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseISO } from "date-fns"
import { Plus } from "lucide-react"
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateMilestone } from "@/hooks/use-create-milestone"
import { createMilestoneSchema } from "@/lib/schemas/programme"
import type { CreateMilestoneFormValues } from "@/lib/types/programme"

const defaultValues: DefaultValues<CreateMilestoneFormValues> = {
  name: "",
  owner: "",
  progress: 0,
  startDate: "",
  deadline: "",
}

type AddMilestoneDialogProps = {
  projectId: string
  /** Weight not yet given to other milestones, 0–100. */
  remainingWeight: number
}

export function AddMilestoneDialog({
  projectId,
  remainingWeight,
}: AddMilestoneDialogProps) {
  const [open, setOpen] = useState(false)
  const createMilestone = useCreateMilestone()
  const schema = useMemo(
    () => createMilestoneSchema(remainingWeight),
    [remainingWeight]
  )
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMilestoneFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  // The deadline picker can't go earlier than the start date.
  const startDate = useWatch({ control, name: "startDate" })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createMilestone.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createMilestone.reset()
    }
  }

  function onSubmit(data: CreateMilestoneFormValues) {
    createMilestone.mutate(
      { projectId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={tableCardActionClassName}>
          <Plus aria-hidden="true" />
          Milestone
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a milestone
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Its weight is its share of the project. Overall progress updates
            from each milestone&apos;s weight and completion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createMilestone.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the milestone. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="milestone-name">Milestone</FieldLabel>
              <Input
                id="milestone-name"
                autoComplete="off"
                placeholder="e.g. Substructure"
                aria-invalid={!!errors.name}
                className={authInputClassName}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.owner}>
              <FieldLabel htmlFor="milestone-owner">Owner</FieldLabel>
              <Input
                id="milestone-owner"
                autoComplete="off"
                placeholder="e.g. James Kamau"
                aria-invalid={!!errors.owner}
                className={authInputClassName}
                {...register("owner")}
              />
              <FieldError>{errors.owner?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.weight}>
              <FieldLabel htmlFor="milestone-weight">Weight (%)</FieldLabel>
              <Input
                id="milestone-weight"
                type="number"
                inputMode="numeric"
                min={1}
                max={remainingWeight}
                step={1}
                placeholder={`Up to ${remainingWeight}`}
                aria-invalid={!!errors.weight}
                className={authInputClassName}
                {...register("weight", { valueAsNumber: true })}
              />
              <FieldDescription>
                {remainingWeight === 0
                  ? "All 100% of the weight is allocated."
                  : `${remainingWeight}% of the weight is unallocated.`}
              </FieldDescription>
              <FieldError>{errors.weight?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.progress}>
              <FieldLabel htmlFor="milestone-progress">Progress (%)</FieldLabel>
              <Input
                id="milestone-progress"
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

            <Field data-invalid={!!errors.startDate}>
              <FieldLabel htmlFor="milestone-start">Start</FieldLabel>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    id="milestone-start"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Choose the start date"
                    aria-invalid={!!errors.startDate}
                  />
                )}
              />
              <FieldError>{errors.startDate?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.deadline}>
              <FieldLabel htmlFor="milestone-deadline">Deadline</FieldLabel>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    id="milestone-deadline"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    minDate={startDate ? parseISO(startDate) : undefined}
                    placeholder="Choose the deadline"
                    aria-invalid={!!errors.deadline}
                  />
                )}
              />
              <FieldError>{errors.deadline?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createMilestone.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createMilestone.isPending}
              className="h-10 rounded-full px-5"
            >
              {createMilestone.isPending ? "Adding…" : "Add milestone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
