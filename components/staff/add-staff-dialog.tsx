"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { ImageUpload } from "@/components/image-upload"
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
import { useCreateStaffMember } from "@/hooks/use-create-staff-member"
import { useProjects } from "@/hooks/use-projects"
import { StaffConflictError } from "@/lib/mock/staff"
import { createStaffMemberSchema } from "@/lib/schemas/staff"
import {
  staffDivisions,
  staffHealthStatuses,
  type CreateStaffMemberFormValues,
} from "@/lib/types/staff"

// Radix Select items can't have an empty value, so "no project" gets its own.
const unassignedValue = "unassigned"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

// No division is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateStaffMemberFormValues> = {
  photo: null,
  staffNumber: "",
  fullName: "",
  email: "",
  phone: "",
  role: "",
  qualification: "",
  competences: "",
  projectId: null,
  health: "Fit",
}

export function AddStaffDialog() {
  const [open, setOpen] = useState(false)
  const createStaffMember = useCreateStaffMember()
  const { data: projects } = useProjects()
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateStaffMemberFormValues>({
    resolver: zodResolver(createStaffMemberSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createStaffMember.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createStaffMember.reset()
    }
  }

  function onSubmit(data: CreateStaffMemberFormValues) {
    createStaffMember.mutate(
      { data },
      {
        onSuccess: () => handleOpenChange(false),
        // A taken staff number or email belongs on its field, not in the banner.
        onError: (error) => {
          if (error instanceof StaffConflictError) {
            setError(
              error.field,
              { message: error.message },
              { shouldFocus: true }
            )
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Add staff
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a staff member
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            KPI scores appear after their first review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createStaffMember.isError &&
            !(createStaffMember.error instanceof StaffConflictError) && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
              >
                We couldn&apos;t add the staff member. Try again.
              </p>
            )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.photo} className="sm:col-span-2">
              <FieldLabel htmlFor="staff-photo">
                Profile photo{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <ImageUpload
                    id="staff-photo"
                    ref={field.ref}
                    shape="circle"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={createStaffMember.isPending}
                    aria-invalid={!!errors.photo}
                  />
                )}
              />
              <FieldError>{errors.photo?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.fullName}>
              <FieldLabel htmlFor="staff-full-name">Full name</FieldLabel>
              <Input
                id="staff-full-name"
                autoComplete="off"
                placeholder="e.g. Peter Mwangi"
                aria-invalid={!!errors.fullName}
                className={authInputClassName}
                {...register("fullName")}
              />
              <FieldError>{errors.fullName?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.staffNumber}>
              <FieldLabel htmlFor="staff-number">Staff number</FieldLabel>
              <Input
                id="staff-number"
                autoComplete="off"
                placeholder="e.g. ID-006"
                aria-invalid={!!errors.staffNumber}
                className={`${authInputClassName} uppercase placeholder:normal-case`}
                {...register("staffNumber")}
              />
              <FieldError>{errors.staffNumber?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="staff-email">Email</FieldLabel>
              <Input
                id="staff-email"
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder="e.g. name@chrysolyte.co.ke"
                aria-invalid={!!errors.email}
                className={authInputClassName}
                {...register("email")}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="staff-phone">Phone</FieldLabel>
              <Input
                id="staff-phone"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="e.g. 0712 345 678"
                aria-invalid={!!errors.phone}
                className={authInputClassName}
                {...register("phone")}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.division}>
              <FieldLabel htmlFor="staff-division">Division</FieldLabel>
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="staff-division"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.division}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a division" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {staffDivisions.map((division) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.division?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="staff-role">Role</FieldLabel>
              <Input
                id="staff-role"
                autoComplete="off"
                placeholder="e.g. Site Supervisor"
                aria-invalid={!!errors.role}
                className={authInputClassName}
                {...register("role")}
              />
              <FieldError>{errors.role?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.dailyRate}>
              <FieldLabel htmlFor="staff-daily-rate">
                Daily rate (KES)
              </FieldLabel>
              <Input
                id="staff-daily-rate"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="e.g. 2500"
                aria-invalid={!!errors.dailyRate}
                className={authInputClassName}
                {...register("dailyRate", { valueAsNumber: true })}
              />
              <FieldError>{errors.dailyRate?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.qualification}>
              <FieldLabel htmlFor="staff-qualification">
                Qualification
              </FieldLabel>
              <Input
                id="staff-qualification"
                autoComplete="off"
                placeholder="e.g. Diploma in Building Construction"
                aria-invalid={!!errors.qualification}
                className={authInputClassName}
                {...register("qualification")}
              />
              <FieldError>{errors.qualification?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.competences}>
              <FieldLabel htmlFor="staff-competences">Competences</FieldLabel>
              <Input
                id="staff-competences"
                autoComplete="off"
                placeholder="e.g. Site supervision, QA/QC, safety"
                aria-invalid={!!errors.competences}
                className={authInputClassName}
                {...register("competences")}
              />
              <FieldDescription>Separate them with commas.</FieldDescription>
              <FieldError>{errors.competences?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.projectId}>
              <FieldLabel htmlFor="staff-project">Assignment</FieldLabel>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? unassignedValue}
                    onValueChange={(value) =>
                      field.onChange(value === unassignedValue ? null : value)
                    }
                  >
                    <SelectTrigger
                      id="staff-project"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.projectId}
                      className={selectTriggerClassName}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value={unassignedValue}>
                        Unassigned
                      </SelectItem>
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

            <Field data-invalid={!!errors.health} className="sm:col-span-2">
              <FieldLabel htmlFor="staff-health">Health</FieldLabel>
              <Controller
                control={control}
                name="health"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="staff-health"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.health}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a health status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {staffHealthStatuses.map((health) => (
                        <SelectItem key={health} value={health}>
                          {health}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.health?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createStaffMember.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createStaffMember.isPending}
              className="h-10 rounded-full px-5"
            >
              {createStaffMember.isPending ? "Adding…" : "Add staff member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
