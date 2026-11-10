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
import { useLogin } from "@/hooks/use-login"
import { getErrorMessage } from "@/lib/api/errors"
import { loginSchema } from "@/lib/schemas/auth"
import type { LoginFormValues } from "@/lib/types/auth"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  const loginMutation = useLogin()

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate({ data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {loginMutation.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            loginMutation.error,
            "We couldn't sign you in. Try again."
          )}
        </p>
      )}

      <div className="flex flex-col gap-5">
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="email" className={authLabelClassName}>
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@chrysolyt.com"
            aria-invalid={!!errors.username}
            className={authInputClassName}
            {...register("username")}
          />
          <FieldError>{errors.username?.message}</FieldError>
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
        disabled={loginMutation.isPending || loginMutation.isSuccess}
        className={authSubmitClassName}
      >
        {loginMutation.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
