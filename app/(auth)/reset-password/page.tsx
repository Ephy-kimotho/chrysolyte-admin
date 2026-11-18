import type { Metadata } from "next"
import Link from "next/link"

import { AuthHeader } from "@/components/auth/auth-header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { authSubmitClassName } from "@/components/auth/styles"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Reset password · Chrysolyte FirmControl",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // The emailed link carries the reset token as `?token=…`.
  const { token: tokenParam } = await searchParams
  const token = (Array.isArray(tokenParam) ? tokenParam[0] : tokenParam)?.trim()

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-sm">
        <AuthHeader
          title="Link not valid"
          description="This reset link is missing its code. Open the link from the email again, or ask for a new one."
        />
        <Button asChild className={authSubmitClassName}>
          <Link href="/forgot-password">Get a new link</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <AuthHeader
        title="Reset password"
        description="Choose a new password for your account."
      />
      <ResetPasswordForm token={token} />
    </div>
  )
}
