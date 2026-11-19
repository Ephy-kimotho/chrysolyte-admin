"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
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
import { useCreateEmergencyContact } from "@/hooks/use-create-emergency-contact"
import { getErrorMessage } from "@/lib/api/errors"
import { createEmergencyContactSchema } from "@/lib/schemas/staff"
import {
  emergencyContactRelationships,
  type CreateEmergencyContactFormValues,
} from "@/lib/types/staff"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

// No relationship is preselected, so the user has to choose one.
const defaultValues: DefaultValues<CreateEmergencyContactFormValues> = {
  name: "",
  phone: "",
}

type AddEmergencyContactDialogProps = {
  staffId: string
  /** Whose contact this is, for the dialog's description. */
  staffName: string
}

export function AddEmergencyContactDialog({
  staffId,
  staffName,
}: AddEmergencyContactDialogProps) {
  const [open, setOpen] = useState(false)
  const createContact = useCreateEmergencyContact()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmergencyContactFormValues>({
    resolver: zodResolver(createEmergencyContactSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createContact.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createContact.reset()
    }
  }

  function onSubmit(data: CreateEmergencyContactFormValues) {
    createContact.mutate(
      { staffId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 rounded-full px-3.5">
          <Plus aria-hidden="true" />
          Add
          <span className="sr-only"> emergency contact</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add an emergency contact
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Who to call if something happens to {staffName} at work.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createContact.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createContact.error,
                "We couldn't add the emergency contact. Try again."
              )}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.name} className="sm:col-span-2">
              <FieldLabel htmlFor="emergency-contact-name">Name</FieldLabel>
              <Input
                id="emergency-contact-name"
                autoComplete="off"
                placeholder="e.g. Grace Wanjiru"
                aria-invalid={!!errors.name}
                className={authInputClassName}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.relationship}>
              <FieldLabel htmlFor="emergency-contact-relationship">
                Relationship
              </FieldLabel>
              <Controller
                control={control}
                name="relationship"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="emergency-contact-relationship"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.relationship}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a relationship" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {emergencyContactRelationships.map((relationship) => (
                        <SelectItem key={relationship} value={relationship}>
                          {relationship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.relationship?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="emergency-contact-phone">Phone</FieldLabel>
              <Input
                id="emergency-contact-phone"
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
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createContact.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createContact.isPending}
              className="h-10 rounded-full px-5"
            >
              {createContact.isPending ? "Adding…" : "Add contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
