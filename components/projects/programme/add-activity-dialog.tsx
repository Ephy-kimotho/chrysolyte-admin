"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateProgrammeActivity } from "@/hooks/use-create-programme-activity"
import { useMilestones } from "@/hooks/use-milestones"
import { getErrorMessage } from "@/lib/api/errors"
import {
  activityMaxLength,
  createProgrammeActivitySchema,
} from "@/lib/schemas/programme"
import type { CreateProgrammeActivityFormValues } from "@/lib/types/programme"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

const defaultValues: DefaultValues<CreateProgrammeActivityFormValues> = {
  milestoneId: "",
  activity: "",
  owner: "",
  startDate: "",
  deadline: "",
  progress: 0,
  material: "",
  forecastQuantity: null,
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}{" "}
      <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  )
}

export function AddActivityDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const createActivity = useCreateProgrammeActivity()
  // Shares the milestones table's cached list.
  const milestones = useMilestones(projectId)
  const milestoneOptions = milestones.data ?? []
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProgrammeActivityFormValues>({
    resolver: zodResolver(createProgrammeActivitySchema),
    defaultValues,
  })
  // The deadline picker can't go earlier than the start date.
  const startDate = useWatch({ control, name: "startDate" })

  let milestonePlaceholder = "Choose a milestone"
  if (milestones.isPending) milestonePlaceholder = "Loading milestones…"
  else if (milestones.isError) milestonePlaceholder = "Couldn't load milestones"
  else if (milestoneOptions.length === 0)
    milestonePlaceholder = "No milestones yet"

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createActivity.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createActivity.reset()
    }
  }

  function onSubmit(data: CreateProgrammeActivityFormValues) {
    createActivity.mutate(
      { projectId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={tableCardActionClassName}>
          <Plus aria-hidden="true" />
          Activity
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add an activity
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Add it to the work programme, with the material it&apos;s forecast
            to need if any.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createActivity.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createActivity.error,
                "We couldn't add the activity. Try again."
              )}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.milestoneId}>
              <FieldLabel htmlFor="activity-milestone">Milestone</FieldLabel>
              <Controller
                control={control}
                name="milestoneId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={milestoneOptions.length === 0}
                  >
                    <SelectTrigger
                      id="activity-milestone"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.milestoneId}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder={milestonePlaceholder} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {milestoneOptions.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {milestones.isSuccess && milestoneOptions.length === 0 && (
                <FieldDescription>
                  Add a milestone first. Every activity counts towards one.
                </FieldDescription>
              )}
              <FieldError>{errors.milestoneId?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.progress}>
              <FieldLabel htmlFor="activity-progress">Progress (%)</FieldLabel>
              <Input
                id="activity-progress"
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

            <Field data-invalid={!!errors.activity}>
              <FieldLabel htmlFor="activity-name">Activity</FieldLabel>
              <Input
                id="activity-name"
                autoComplete="off"
                placeholder="e.g. Column formwork"
                maxLength={activityMaxLength}
                aria-invalid={!!errors.activity}
                className={authInputClassName}
                {...register("activity")}
              />
              <FieldError>{errors.activity?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.owner}>
              <FieldLabel htmlFor="activity-owner">Owner</FieldLabel>
              <Input
                id="activity-owner"
                autoComplete="off"
                placeholder="e.g. Peter Mwangi"
                aria-invalid={!!errors.owner}
                className={authInputClassName}
                {...register("owner")}
              />
              <FieldError>{errors.owner?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.startDate}>
              <FieldLabel htmlFor="activity-start-date">Start date</FieldLabel>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    id="activity-start-date"
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
              <FieldLabel htmlFor="activity-deadline">Deadline</FieldLabel>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    id="activity-deadline"
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

            <Field data-invalid={!!errors.material}>
              <FieldLabel htmlFor="activity-material">
                <OptionalLabel>Forecast material</OptionalLabel>
              </FieldLabel>
              <Input
                id="activity-material"
                autoComplete="off"
                placeholder="e.g. Cement"
                aria-invalid={!!errors.material}
                className={authInputClassName}
                {...register("material")}
              />
              <FieldError>{errors.material?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.forecastQuantity}>
              <FieldLabel htmlFor="activity-forecast-quantity">
                <OptionalLabel>Forecast quantity</OptionalLabel>
              </FieldLabel>
              <Input
                id="activity-forecast-quantity"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 80"
                aria-invalid={!!errors.forecastQuantity}
                className={authInputClassName}
                {...register("forecastQuantity", {
                  // An empty field means no forecast, not zero.
                  setValueAs: (value: string) =>
                    value === "" ? null : Number(value),
                })}
              />
              <FieldError>{errors.forecastQuantity?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createActivity.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createActivity.isPending}
              className="h-10 rounded-full px-5"
            >
              {createActivity.isPending ? "Adding…" : "Add activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
