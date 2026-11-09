"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { PasswordInput } from "@/components/auth/password-input"
import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authSubmitClassName,
} from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/lib/schemas/auth"
import type { LoginFormValues } from "@/lib/types/auth"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  // The API client isn't wired up yet; this becomes a useLogin mutation hook.
  function onSubmit() {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-5">
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

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password" className={authLabelClassName}>
            Password
          </FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
      </div>

      <div className="mt-3 flex justify-end">
        <Link href="/forgot-password" className={authLinkClassName}>
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={authSubmitClassName}
      >
        Sign in
      </Button>
    </form>
  )
}
