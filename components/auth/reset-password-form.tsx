"use client"

import Link from "next/link"
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
import { useResetPassword } from "@/hooks/use-reset-password"
import { getErrorMessage } from "@/lib/api/errors"
import { resetPasswordSchema } from "@/lib/schemas/auth"
import { cn } from "@/lib/utils"
import type { ResetPasswordFormValues } from "@/lib/types/auth"

/** Sets a new password with the token from an emailed reset link. */
export function ResetPasswordForm({ token }: { token: string }) {
  const resetPassword = useResetPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword.mutate({ data, token })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {resetPassword.isError && (
        <AuthAlert>
          {getErrorMessage(
            resetPassword.error,
            "We couldn't reset your password. Try again."
          )}{" "}
          {/* An expired or used link can't be retried, only replaced. */}
          <Link
            href="/forgot-password"
            className={cn(authLinkClassName, "text-destructive underline")}
          >
            Get a new link
          </Link>
        </AuthAlert>
      )}

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
              At least 8 characters, with an uppercase letter, a lowercase
              letter, a number and a symbol.
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
        disabled={resetPassword.isPending || resetPassword.isSuccess}
        className={authSubmitClassName}
      >
        {resetPassword.isPending ? "Resetting…" : "Reset password"}
      </Button>

      <p className="mt-6 text-center">
        <Link href="/login" className={authLinkClassName}>
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
