import type { Metadata } from "next"

import { LoginTabs } from "@/components/auth/login-tabs"

export const metadata: Metadata = {
  title: "Sign in · Chrysolyte FirmControl",
}

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <LoginTabs />
    </div>
  )
}
