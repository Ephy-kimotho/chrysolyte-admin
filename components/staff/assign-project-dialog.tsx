"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form"

import { DatePicker } from "@/components/date-picker"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useAssignProject } from "@/hooks/use-assign-project"
import { getErrorMessage } from "@/lib/api/errors"
import { assignProjectSchema } from "@/lib/schemas/staff"
import type { AssignProjectFormValues, StaffMember } from "@/lib/types/staff"

// The assignment starts today, the usual case; the rest must be filled in.
function getDefaultValues(): DefaultValues<AssignProjectFormValues> {
  return {
    projectId: "",
    assignedFrom: format(new Date(), "yyyy-MM-dd"),
    assignedTo: "",
  }
}

type AssignProjectDialogProps = {
  member: StaffMember
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function AssignProjectDialog({
  member,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: AssignProjectDialogProps) {
  const assignProject = useAssignProject()

  function handleOpenChange(nextOpen: boolean) {
    if (assignProject.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) assignProject.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Assign project
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Choose the project {member.fullName} will work on, and for how long.
          </DialogDescription>
        </DialogHeader>

        {/* Mounted only while open, so each opening starts with an empty form. */}
        {open && (
          <AssignProjectForm
            staffId={member.id}
            isPending={assignProject.isPending}
            error={assignProject.isError ? assignProject.error : null}
            onSubmit={(data, projectName) =>
              assignProject.mutate(
                {
                  staffId: member.id,
                  staffName: member.fullName,
                  projectName,
                  data,
                },
                { onSuccess: () => onOpenChange(false) }
              )
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function AssignProjectForm({
  staffId,
  isPending,
  error,
  onSubmit,
}: {
  staffId: string
  isPending: boolean
  error: Error | null
  onSubmit: (data: AssignProjectFormValues, projectName: string) => void
}) {
  // The chosen project's name, for the confirmation message.
  const [projectName, setProjectName] = useState("")
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignProjectFormValues>({
    resolver: zodResolver(assignProjectSchema),
    defaultValues: getDefaultValues(),
  })
  const assignedFrom = useWatch({ control, name: "assignedFrom" })
  const idPrefix = `assign-project-${staffId}`

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, projectName))}
      noValidate
    >
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(error, "We couldn't assign the project. Try again.")}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.projectId} className="sm:col-span-2">
          <FieldLabel htmlFor={`${idPrefix}-project`}>Project</FieldLabel>
          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <ProjectCombobox
                id={`${idPrefix}-project`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={(option) => {
                  field.onChange(option?.value ?? "")
                  setProjectName(option?.label ?? "")
                }}
                onBlur={field.onBlur}
                disabled={isPending}
                aria-invalid={!!errors.projectId}
              />
            )}
          />
          <FieldError>{errors.projectId?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.assignedFrom}>
          <FieldLabel htmlFor={`${idPrefix}-from`}>From</FieldLabel>
          <Controller
            control={control}
            name="assignedFrom"
            render={({ field }) => (
              <DatePicker
                id={`${idPrefix}-from`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose the start date"
                disabled={isPending}
                aria-invalid={!!errors.assignedFrom}
              />
            )}
          />
          <FieldError>{errors.assignedFrom?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.assignedTo}>
          <FieldLabel htmlFor={`${idPrefix}-to`}>To</FieldLabel>
          <Controller
            control={control}
            name="assignedTo"
            render={({ field }) => (
              <DatePicker
                id={`${idPrefix}-to`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                minDate={assignedFrom ? parseISO(assignedFrom) : undefined}
                placeholder="Choose the end date"
                disabled={isPending}
                aria-invalid={!!errors.assignedTo}
              />
            )}
          />
          <FieldError>{errors.assignedTo?.message}</FieldError>
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-full px-5"
        >
          {isPending ? "Assigning…" : "Assign project"}
        </Button>
      </div>
    </form>
  )
}
