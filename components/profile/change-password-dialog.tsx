"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound } from "lucide-react"
import { useForm } from "react-hook-form"

import { PasswordInput } from "@/components/auth/password-input"
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
import { useChangePassword } from "@/hooks/use-change-password"
import { getErrorMessage } from "@/lib/api/errors"
import { changePasswordSchema } from "@/lib/schemas/auth"
import type { ChangePasswordFormValues } from "@/lib/types/auth"

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

type ChangePasswordDialogProps = {
  /** Called after the password changes and the dialog closes. */
  onChanged?: () => void
}

export function ChangePasswordDialog({ onChanged }: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const changePassword = useChangePassword()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover server error.
  function handleOpenChange(nextOpen: boolean) {
    if (changePassword.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      changePassword.reset()
    }
  }

  function onSubmit(data: ChangePasswordFormValues) {
    changePassword.mutate(
      { data },
      {
        onSuccess: () => {
          handleOpenChange(false)
          onChanged?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4">
          <KeyRound aria-hidden="true" />
          Change password
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Change your password
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Enter your current password to confirm it&apos;s you, then choose a
            new password. You&apos;ll use the new one the next time you sign in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {changePassword.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                changePassword.error,
                "We couldn't change your password. Try again."
              )}
            </p>
          )}

          <div className="flex flex-col gap-5">
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="current-password">
                Current password
              </FieldLabel>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                placeholder="Enter your current password"
                aria-invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              <FieldError>{errors.currentPassword?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                placeholder="Enter your new password"
                aria-invalid={!!errors.newPassword}
                aria-describedby="new-password-hint"
                {...register("newPassword")}
              />
              {errors.newPassword ? (
                <FieldError>{errors.newPassword.message}</FieldError>
              ) : (
                <FieldDescription id="new-password-hint" className="text-xs">
                  At least 8 characters, with an uppercase letter, a lowercase
                  letter, a number and a symbol.
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-new-password">
                Confirm new password
              </FieldLabel>
              <PasswordInput
                id="confirm-new-password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={changePassword.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="h-10 rounded-full px-5"
            >
              {changePassword.isPending ? "Saving…" : "Save new password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
