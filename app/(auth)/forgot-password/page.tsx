import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password · Chrysolyte FirmControl",
}

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-sm">
      <AuthHeader
        title="Forgot password"
        description="Enter your email address and we'll send you instructions on how to reset your password."
      />
      <ForgotPasswordForm />
    </section>
  )
}
