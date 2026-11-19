"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { ImageUpload } from "@/components/image-upload"
import { StaffDetailsFields } from "@/components/staff/staff-details-fields"
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
import { useCreateStaffMember } from "@/hooks/use-create-staff-member"
import { getErrorMessage } from "@/lib/api/errors"
import { createStaffMemberSchema } from "@/lib/schemas/staff"
import type {
  CreateStaffMemberFormInput,
  CreateStaffMemberFormValues,
} from "@/lib/types/staff"

// No division or employment type is preselected, so the user has to choose.
// The start date defaults to today, worked out on each opening.
function getDefaultValues(): Partial<CreateStaffMemberFormInput> {
  return {
    photo: null,
    fullName: "",
    idNo: "",
    email: "",
    phone: "",
    role: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    health: "Fit",
    returnToWork: "",
  }
}

export function AddStaffDialog() {
  const [open, setOpen] = useState(false)
  const createStaffMember = useCreateStaffMember()
  const form = useForm<
    CreateStaffMemberFormInput,
    unknown,
    CreateStaffMemberFormValues
  >({
    resolver: zodResolver(createStaffMemberSchema),
    defaultValues: getDefaultValues(),
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createStaffMember.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(getDefaultValues())
      createStaffMember.reset()
    }
  }

  function onSubmit(data: CreateStaffMemberFormValues) {
    createStaffMember.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
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
          {createStaffMember.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createStaffMember.error,
                "We couldn't add the staff member. Try again."
              )}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.photo} className="sm:col-span-2">
              <FieldLabel htmlFor="add-staff-photo">
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
                    id="add-staff-photo"
                    ref={field.ref}
                    shape="circle"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={createStaffMember.isPending}
                    aria-invalid={!!errors.photo}
                  />
                )}
              />
              <FieldError>{errors.photo?.message}</FieldError>
            </Field>

            <FormProvider {...form}>
              <StaffDetailsFields idPrefix="add-staff" />
            </FormProvider>
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
