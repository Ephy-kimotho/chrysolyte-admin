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
import { useCreateDesignDeliverable } from "@/hooks/use-create-design-deliverable"
import { useProjects } from "@/hooks/use-projects"
import { createDesignDeliverableSchema } from "@/lib/schemas/design"
import type { CreateDesignDeliverableFormValues } from "@/lib/types/design"

// No project is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateDesignDeliverableFormValues> = {
  discipline: "",
  stage: "",
  deliverable: "",
  lead: "",
  deadline: "",
  progress: 0,
}

export function AddDeliverableDialog() {
  const [open, setOpen] = useState(false)
  const createDeliverable = useCreateDesignDeliverable()
  const { data: projects } = useProjects()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDesignDeliverableFormValues>({
    resolver: zodResolver(createDesignDeliverableSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createDeliverable.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createDeliverable.reset()
    }
  }

  function onSubmit(data: CreateDesignDeliverableFormValues) {
    createDeliverable.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 rounded-xl px-3 text-xs font-semibold">
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
              We couldn&apos;t add the deliverable. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.projectId}>
              <FieldLabel htmlFor="deliverable-project">Project</FieldLabel>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="deliverable-project"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.projectId}
                      className="h-11! w-full rounded-xl bg-background/60 px-3.5"
                    >
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.projectId?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.discipline}>
              <FieldLabel htmlFor="deliverable-discipline">
                Discipline
              </FieldLabel>
              <Input
                id="deliverable-discipline"
                autoComplete="off"
                placeholder="e.g. Architecture"
                aria-invalid={!!errors.discipline}
                className={authInputClassName}
                {...register("discipline")}
              />
              <FieldError>{errors.discipline?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.stage}>
              <FieldLabel htmlFor="deliverable-stage">Stage</FieldLabel>
              <Input
                id="deliverable-stage"
                autoComplete="off"
                placeholder="e.g. Concept design"
                aria-invalid={!!errors.stage}
                className={authInputClassName}
                {...register("stage")}
              />
              <FieldError>{errors.stage?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.deliverable}>
              <FieldLabel htmlFor="deliverable-name">Deliverable</FieldLabel>
              <Input
                id="deliverable-name"
                autoComplete="off"
                placeholder="e.g. Floor plans"
                aria-invalid={!!errors.deliverable}
                className={authInputClassName}
                {...register("deliverable")}
              />
              <FieldError>{errors.deliverable?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.lead}>
              <FieldLabel htmlFor="deliverable-lead">Lead</FieldLabel>
              <Input
                id="deliverable-lead"
                autoComplete="off"
                placeholder="e.g. Irene Kamau"
                aria-invalid={!!errors.lead}
                className={authInputClassName}
                {...register("lead")}
              />
              <FieldError>{errors.lead?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.deadline}>
              <FieldLabel htmlFor="deliverable-deadline">Deadline</FieldLabel>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    id="deliverable-deadline"
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

            <Field data-invalid={!!errors.progress} className="sm:col-span-2">
              <FieldLabel htmlFor="deliverable-progress">
                Progress (%)
              </FieldLabel>
              <Input
                id="deliverable-progress"
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
