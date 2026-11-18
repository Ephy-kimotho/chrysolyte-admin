import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { ChangePasswordForm } from "@/components/auth/change-password-form"

export const metadata: Metadata = {
  title: "Change password · Chrysolyte FirmControl",
}

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <AuthHeader
        title="Change your password"
        description="You signed in with a temporary password. Choose a new one to continue."
      />
      <ChangePasswordForm />
    </div>
  )
}
