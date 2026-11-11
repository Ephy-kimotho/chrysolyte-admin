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
import { useCreateProject } from "@/hooks/use-create-project"
import { createProjectSchema } from "@/lib/schemas/projects"
import {
  projectPhases,
  type CreateProjectFormValues,
} from "@/lib/types/projects"

// No phase is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateProjectFormValues> = {
  name: "",
  location: "",
  dueDate: "",
}

export function AddProjectDialog() {
  const [open, setOpen] = useState(false)
  const createProject = useCreateProject()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createProject.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createProject.reset()
    }
  }

  function onSubmit(data: CreateProjectFormValues) {
    createProject.mutate({ data }, { onSuccess: () => handleOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Add project
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a project
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            The project gets a reference code when you add it. Its progress
            starts at 0% and updates automatically as work is logged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createProject.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the project. Try again.
            </p>
          )}

          <div className="flex flex-col gap-5">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>
              <Input
                id="project-name"
                autoComplete="off"
                placeholder="e.g. Kilimani Residence"
                aria-invalid={!!errors.name}
                className={authInputClassName}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.phase}>
                <FieldLabel htmlFor="project-phase">Phase</FieldLabel>
                <Controller
                  control={control}
                  name="phase"
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      // "" shows the placeholder again after the form resets.
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="project-phase"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-invalid={!!errors.phase}
                        className="h-11! w-full rounded-xl bg-background/60 px-3.5"
                      >
                        <SelectValue placeholder="Choose a phase" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {projectPhases.map((phase) => (
                          <SelectItem key={phase} value={phase}>
                            {phase}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.phase?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.dueDate}>
                <FieldLabel htmlFor="project-due-date">Due date</FieldLabel>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DatePicker
                      id="project-due-date"
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Choose the due date"
                      aria-invalid={!!errors.dueDate}
                    />
                  )}
                />
                <FieldError>{errors.dueDate?.message}</FieldError>
              </Field>
            </div>

            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="project-location">Location</FieldLabel>
              <Input
                id="project-location"
                autoComplete="off"
                placeholder="e.g. Westlands, Nairobi"
                aria-invalid={!!errors.location}
                className={authInputClassName}
                {...register("location")}
              />
              <FieldError>{errors.location?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createProject.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="h-10 rounded-full px-5"
            >
              {createProject.isPending ? "Adding…" : "Add project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
