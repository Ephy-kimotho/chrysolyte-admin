import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password · Chrysolyte FirmControl",
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <AuthHeader
        title="Reset password"
        description="Choose a new password for your account."
      />
      <ResetPasswordForm />
    </div>
  )
}
