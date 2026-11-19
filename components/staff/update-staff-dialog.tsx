"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { StaffDetailsFields } from "@/components/staff/staff-details-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useUpdateStaffMember } from "@/hooks/use-update-staff-member"
import { getErrorMessage } from "@/lib/api/errors"
import { updateStaffMemberSchema } from "@/lib/schemas/staff"
import {
  staffDivisions,
  staffEmploymentTypes,
  staffHealthStatuses,
  type StaffMember,
  type UpdateStaffMemberFormInput,
  type UpdateStaffMemberFormValues,
} from "@/lib/types/staff"

/** `value` if it's one of `options`, else undefined so the select starts empty. */
function pickKnown<T extends string>(options: readonly T[], value: string) {
  return options.find((option) => option === value)
}

// The record may hold values the form doesn't offer, e.g. an old employment
// type. Those start empty, so the user picks a current one before saving.
function toFormValues(
  member: StaffMember
): Partial<UpdateStaffMemberFormInput> {
  return {
    fullName: member.fullName,
    email: member.email,
    phone: member.phone,
    division: pickKnown(staffDivisions, member.division),
    role: member.role,
    employmentType: pickKnown(staffEmploymentTypes, member.employmentType),
    startDate: member.startDate,
    dailyRate: member.dailyRate,
    health: pickKnown(staffHealthStatuses, member.health),
    returnToWork: member.returnToWork ?? "",
    isActive: member.isActive,
  }
}

type UpdateStaffDialogProps = {
  member: StaffMember
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateStaffDialog({
  member,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateStaffDialogProps) {
  const updateStaffMember = useUpdateStaffMember()

  function handleOpenChange(nextOpen: boolean) {
    if (updateStaffMember.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateStaffMember.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update staff member
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {member.fullName}.
          </DialogDescription>
        </DialogHeader>

        {/* Mounted only while open, so each opening starts from the record. */}
        {open && (
          <UpdateStaffForm
            member={member}
            isPending={updateStaffMember.isPending}
            error={updateStaffMember.isError ? updateStaffMember.error : null}
            onSubmit={(data) =>
              updateStaffMember.mutate(
                { staffId: member.id, data },
                { onSuccess: () => onOpenChange(false) }
              )
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function UpdateStaffForm({
  member,
  isPending,
  error,
  onSubmit,
}: {
  member: StaffMember
  isPending: boolean
  error: Error | null
  onSubmit: (data: UpdateStaffMemberFormValues) => void
}) {
  const form = useForm<
    UpdateStaffMemberFormInput,
    unknown,
    UpdateStaffMemberFormValues
  >({
    resolver: zodResolver(updateStaffMemberSchema),
    defaultValues: toFormValues(member),
  })
  const idPrefix = `update-staff-${member.id}`

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            error,
            "We couldn't update the staff member. Try again."
          )}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormProvider {...form}>
          <StaffDetailsFields idPrefix={idPrefix} showIdNo={false} />
        </FormProvider>

        <Field
          orientation="horizontal"
          className="items-center justify-between gap-4 rounded-xl border p-3.5 sm:col-span-2"
        >
          <FieldContent>
            <FieldLabel htmlFor={`${idPrefix}-active`}>Active</FieldLabel>
            <FieldDescription id={`${idPrefix}-active-description`}>
              When this is off, {member.fullName} can&apos;t sign in to their
              account.
            </FieldDescription>
          </FieldContent>
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id={`${idPrefix}-active`}
                ref={field.ref}
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isPending}
                aria-describedby={`${idPrefix}-active-description`}
              />
            )}
          />
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
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
