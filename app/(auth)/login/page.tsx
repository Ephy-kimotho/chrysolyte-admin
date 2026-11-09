import type { Metadata } from "next"

import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in · Chrysolyte FirmControl",
}

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <AuthHeader
        title="Sign in"
        description="Use your staff email and password to continue."
      />
      <LoginForm />
    </div>
  )
}
