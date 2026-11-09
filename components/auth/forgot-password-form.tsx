"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authSubmitClassName,
} from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { forgotPasswordSchema } from "@/lib/schemas/auth"
import type { ForgotPasswordFormValues } from "@/lib/types/auth"

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  // The API client isn't wired up yet; this becomes a useForgotPassword
  // mutation hook.
  function onSubmit() {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        disabled={isSubmitting}
        className={authSubmitClassName}
      >
        Send
      </Button>

      <p className="mt-6 text-center">
        <Link href="/login" className={authLinkClassName}>
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
