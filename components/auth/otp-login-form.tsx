"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Controller, useForm } from "react-hook-form"

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRequestLoginOtp } from "@/hooks/use-request-login-otp"
import { useVerifyLoginOtp } from "@/hooks/use-verify-login-otp"
import { getErrorMessage } from "@/lib/api/errors"
import { formatCountdown, pluralize } from "@/lib/format"
import { otpRequestSchema, otpVerifySchema } from "@/lib/schemas/auth"
import type {
  OtpRequestFormValues,
  OtpVerifyFormValues,
} from "@/lib/types/auth"

/** Matches the API's `OTP_RESEND_COOLDOWN_SECONDS`. */
const RESEND_COOLDOWN_SECONDS = 60

interface SentCode {
  email: string
  expiresInSeconds: number
  /** When the code was sent. A resend changes it, which resets the code step. */
  sentAt: number
}

/** Passwordless sign-in: request a code by email, then enter it. */
export function OtpLoginForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState<SentCode | null>(null)
  const requestMutation = useRequestLoginOtp()

  function requestCode(identifier: string) {
    requestMutation.mutate(
      { data: { identifier } },
      {
        onSuccess: (response) => {
          setEmail(identifier)
          setSent({
            email: identifier,
            expiresInSeconds: response.expires_in_seconds,
            sentAt: Date.now(),
          })
        },
      }
    )
  }

  const requestError = requestMutation.isError
    ? getErrorMessage(
        requestMutation.error,
        "We couldn't send a code. Try again."
      )
    : null

  if (!sent) {
    return (
      <EmailStep
        defaultEmail={email}
        isPending={requestMutation.isPending}
        error={requestError}
        onSubmit={({ identifier }) => requestCode(identifier)}
      />
    )
  }

  return (
    <CodeStep
      key={sent.sentAt}
      sent={sent}
      isResending={requestMutation.isPending}
      resendError={requestError}
      onResend={() => requestCode(sent.email)}
      onChangeEmail={() => {
        requestMutation.reset()
        setSent(null)
      }}
    />
  )
}

function EmailStep({
  defaultEmail,
  isPending,
  error,
  onSubmit,
}: {
  defaultEmail: string
  isPending: boolean
  error: string | null
  onSubmit: (values: OtpRequestFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpRequestFormValues>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: { identifier: defaultEmail },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <AuthAlert>{error}</AuthAlert>}

      <Field data-invalid={!!errors.identifier}>
        <FieldLabel htmlFor="otp-email" className={authLabelClassName}>
          Email
        </FieldLabel>
        <Input
          id="otp-email"
          type="email"
          autoComplete="email"
          placeholder="you@chrysolyte.com"
          aria-invalid={!!errors.identifier}
          className={authInputClassName}
          {...register("identifier")}
        />
        <FieldError>{errors.identifier?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className={authSubmitClassName}
      >
        {isPending ? "Sending code…" : "Send code"}
      </Button>
    </form>
  )
}

const slotClassName =
  "size-auto h-11 min-w-0 flex-1 rounded-xl border bg-background/60 font-mono text-lg font-semibold first:rounded-l-xl first:border-l last:rounded-r-xl sm:h-12"

function CodeStep({
  sent,
  isResending,
  resendError,
  onResend,
  onChangeEmail,
}: {
  sent: SentCode
  isResending: boolean
  resendError: string | null
  onResend: () => void
  onChangeEmail: () => void
}) {
  const verifyMutation = useVerifyLoginOtp()
  const {
    control,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { code: "" },
  })

  const resendIn = useSecondsUntil(sent.sentAt + RESEND_COOLDOWN_SECONDS * 1000)
  const expiresInMinutes = Math.max(1, Math.round(sent.expiresInSeconds / 60))
  const isDone = verifyMutation.isSuccess
  const isInvalid = !!errors.code || verifyMutation.isError

  function onSubmit({ code }: OtpVerifyFormValues) {
    if (verifyMutation.isPending) return
    verifyMutation.mutate(
      { data: { identifier: sent.email, code } },
      {
        // Clear the boxes so the next attempt starts from the first one.
        onError: () => {
          resetField("code")
          setFocus("code")
        },
      }
    )
  }

  const error =
    resendError ??
    (verifyMutation.isError
      ? getErrorMessage(
          verifyMutation.error,
          "That code didn't work. Check it and try again."
        )
      : null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <AuthAlert>{error}</AuthAlert>}

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Enter the 6-digit code we sent to{" "}
        <span className="font-medium wrap-break-word text-foreground">
          {sent.email}
        </span>
        . Check WhatsApp too. It expires in {expiresInMinutes}{" "}
        {pluralize(expiresInMinutes, "minute", "minutes")}.{" "}
        <button
          type="button"
          onClick={onChangeEmail}
          className={authLinkClassName}
        >
          Change email
        </button>
      </p>

      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="otp-code" className={authLabelClassName}>
          Login code
        </FieldLabel>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <InputOTP
              ref={field.ref}
              id="otp-code"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onComplete={() => void handleSubmit(onSubmit)()}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              disabled={isDone}
              aria-invalid={isInvalid}
              containerClassName="w-full gap-1.5 sm:gap-2"
            >
              <InputOTPGroup className="flex-1 gap-1.5 sm:gap-2">
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    aria-invalid={isInvalid}
                    className={slotClassName}
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator className="hidden items-center text-muted-foreground sm:flex [&_svg]:size-3.5" />
              <InputOTPGroup className="flex-1 gap-1.5 sm:gap-2">
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    aria-invalid={isInvalid}
                    className={slotClassName}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        <FieldError>{errors.code?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        disabled={verifyMutation.isPending || isDone}
        className={authSubmitClassName}
      >
        {verifyMutation.isPending ? "Signing in…" : "Verify & sign in"}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{" "}
        {resendIn > 0 ? (
          <span className="tabular-nums">
            Resend in {formatCountdown(resendIn)}
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={isResending || isDone}
            className={authLinkClassName}
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>
    </form>
  )
}

/** Whole seconds left until `deadline` (a timestamp), ticking once a second. */
function useSecondsUntil(deadline: number) {
  const [now, setNow] = useState(() => Date.now())
  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000))

  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = setTimeout(() => setNow(Date.now()), 1000)
    return () => clearTimeout(timer)
  }, [now, secondsLeft])

  return secondsLeft
}
