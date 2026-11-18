"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { MailCheck } from "lucide-react"
import { useForm } from "react-hook-form"

import { AuthAlert } from "@/components/auth/auth-alert"
import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authSubmitClassName,
} from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRequestPasswordReset } from "@/hooks/use-request-password-reset"
import { getErrorMessage } from "@/lib/api/errors"
import { forgotPasswordSchema } from "@/lib/schemas/auth"
import type { ForgotPasswordFormValues } from "@/lib/types/auth"

export function ForgotPasswordForm() {
  const resetRequest = useRequestPasswordReset()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(data: ForgotPasswordFormValues) {
    resetRequest.mutate({ data })
  }

  if (resetRequest.isSuccess) {
    return (
      <SentNotice
        email={resetRequest.variables.data.email}
        message={resetRequest.data.message}
        // The form's values outlive the notice, so the email is still filled
        // in when the user goes back to it.
        onTryAgain={() => resetRequest.reset()}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {resetRequest.isError && (
        <AuthAlert>
          {getErrorMessage(
            resetRequest.error,
            "We couldn't send a reset link. Try again."
          )}
        </AuthAlert>
      )}

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email" className={authLabelClassName}>
          Email
        </FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@chrysolyte.com"
          aria-invalid={!!errors.email}
          className={authInputClassName}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        disabled={resetRequest.isPending}
        className={authSubmitClassName}
      >
        {resetRequest.isPending ? "Sending link…" : "Send reset link"}
      </Button>

      <p className="mt-6 text-center">
        <Link href="/login" className={authLinkClassName}>
          Back to sign in
        </Link>
      </p>
    </form>
  )
}

function SentNotice({
  email,
  message,
  onTryAgain,
}: {
  email: string
  message: string
  onTryAgain: () => void
}) {
  return (
    <div>
      <div
        role="status"
        className="flex gap-3 rounded-xl bg-success-muted px-3.5 py-3 text-sm"
      >
        <MailCheck
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-success"
        />
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-foreground">{message}</p>
          <p className="leading-relaxed wrap-break-word text-muted-foreground">
            Open the link in the email to {email} to choose a new password. If
            it isn&apos;t in your inbox, check your spam folder.
          </p>
        </div>
      </div>

      <Button asChild className={authSubmitClassName}>
        <Link href="/login">Back to sign in</Link>
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Wrong email or nothing arrived?{" "}
        <button
          type="button"
          onClick={onTryAgain}
          className={authLinkClassName}
        >
          Try again
        </button>
      </p>
    </div>
  )
}
