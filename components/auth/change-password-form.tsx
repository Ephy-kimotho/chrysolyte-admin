"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { AuthAlert } from "@/components/auth/auth-alert"
import { PasswordInput } from "@/components/auth/password-input"
import {
  authLabelClassName,
  authLinkClassName,
  authSubmitClassName,
} from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { useChangePassword } from "@/hooks/use-change-password"
import { useLogout } from "@/hooks/use-logout"
import { getErrorMessage } from "@/lib/api/errors"
import { changePasswordSchema } from "@/lib/schemas/auth"
import type { ChangePasswordFormValues } from "@/lib/types/auth"

/**
 * Replaces the temporary password a new account signs in with. Once it
 * changes, the reloaded profile no longer needs a change, and the auth guard
 * sends the user on to their home page.
 */
export function ChangePasswordForm() {
  const changePassword = useChangePassword()
  const logout = useLogout()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: ChangePasswordFormValues) {
    changePassword.mutate({ data })
  }

  const isBusy =
    changePassword.isPending || changePassword.isSuccess || logout.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {changePassword.isError && (
        <AuthAlert>
          {getErrorMessage(
            changePassword.error,
            "We couldn't change your password. Try again."
          )}
        </AuthAlert>
      )}

      <div className="flex flex-col gap-5">
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="current-password" className={authLabelClassName}>
            Temporary password
          </FieldLabel>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            placeholder="Enter the password you signed in with"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          <FieldError>{errors.currentPassword?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="new-password" className={authLabelClassName}>
            New password
          </FieldLabel>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            placeholder="Enter a new password"
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
          <FieldLabel
            htmlFor="confirm-new-password"
            className={authLabelClassName}
          >
            Confirm new password
          </FieldLabel>
          <PasswordInput
            id="confirm-new-password"
            autoComplete="new-password"
            placeholder="Re-enter the new password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
      </div>

      <Button type="submit" disabled={isBusy} className={authSubmitClassName}>
        {changePassword.isPending ? "Saving…" : "Set new password"}
      </Button>

      <p className="mt-6 text-center">
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={isBusy}
          className={authLinkClassName}
        >
          {logout.isPending ? "Signing out…" : "Sign out instead"}
        </button>
      </p>
    </form>
  )
}
