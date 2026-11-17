"use client"

import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"
import { OtpLoginForm } from "@/components/auth/otp-login-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLoginMethod, type LoginMethod } from "@/hooks/use-login-method"

const descriptions: Record<LoginMethod, string> = {
  otp: "We'll email you a one-time code to sign in.",
  password: "For management. Use your email and password.",
}

const triggerClassName = "rounded-lg text-sm"

/** Switches between emailed-code sign-in and password sign-in. */
export function LoginTabs() {
  const [method, setMethod] = useLoginMethod()

  return (
    <>
      <AuthHeader title="Sign in" description={descriptions[method]} />

      <Tabs
        value={method}
        onValueChange={(value) => setMethod(value as LoginMethod)}
        className="gap-6"
      >
        <TabsList className="w-full rounded-xl p-1 group-data-[orientation=horizontal]/tabs:h-11">
          <TabsTrigger value="otp" className={triggerClassName}>
            Email code
          </TabsTrigger>
          <TabsTrigger value="password" className={triggerClassName}>
            Password
          </TabsTrigger>
        </TabsList>

        {/* Kept mounted so switching tabs doesn't lose a code in progress. */}
        <TabsContent
          value="otp"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <OtpLoginForm />
        </TabsContent>
        <TabsContent
          value="password"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <LoginForm />
        </TabsContent>
      </Tabs>
    </>
  )
}
