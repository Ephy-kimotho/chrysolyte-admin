"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { PasswordInput } from "@/components/auth/password-input"
import {
  authLabelClassName,
  authSubmitClassName,
} from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { resetPasswordSchema } from "@/lib/schemas/auth"
import type { ResetPasswordFormValues } from "@/lib/types/auth"

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  // The API client isn't wired up yet; this becomes a useResetPassword
  // mutation hook, sent along with the reset token from the email link.
  function onSubmit() {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-5">
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password" className={authLabelClassName}>
            New password
          </FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Enter a new password"
            aria-invalid={!!errors.password}
            aria-describedby="password-hint"
            {...register("password")}
          />
          {errors.password ? (
            <FieldError>{errors.password.message}</FieldError>
          ) : (
            <FieldDescription id="password-hint" className="text-xs">
              Use at least 8 characters.
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword" className={authLabelClassName}>
            Confirm password
          </FieldLabel>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter the new password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={authSubmitClassName}
      >
        Reset password
      </Button>
    </form>
  )
}
