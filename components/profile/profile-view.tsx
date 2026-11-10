"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"

import { ChangePasswordDialog } from "@/components/profile/change-password-dialog"
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLogout } from "@/hooks/use-logout"
import { formatDateTime, humanizeSlug } from "@/lib/format"
import type { AuthUser } from "@/lib/types/auth"
import { useAuth } from "@/providers/auth-provider"

export function ProfileView() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <ProfileCard user={user} />
      <AccountCard />
    </div>
  )
}

function ProfileCard({ user }: { user: AuthUser }) {
  const details = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    {
      label: "Last sign in",
      value: user.last_login_at ? formatDateTime(user.last_login_at) : "Never",
    },
    { label: "Member since", value: formatDateTime(user.created_at) },
  ]

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-6 px-5 sm:px-6">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={user.full_name}
            className="size-14 text-lg sm:size-16 sm:text-xl"
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="truncate font-heading text-xl font-bold text-heading sm:text-2xl">
              {user.full_name}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">{humanizeSlug(user.role)}</Badge>
              <StatusBadge user={user} />
            </div>
          </div>
        </div>

        <Separator />

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {detail.label}
              </dt>
              <dd className="text-sm wrap-break-word sm:text-base">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ user }: { user: AuthUser }) {
  if (user.is_locked) return <Badge variant="destructive">Locked</Badge>
  if (!user.active) return <Badge variant="warning">Inactive</Badge>
  return <Badge className="bg-primary/15 text-primary">Active</Badge>
}

function AccountCard() {
  const logoutMutation = useLogout()
  const [passwordChanged, setPasswordChanged] = useState(false)

  return (
    <Card className="rounded-2xl">
      <CardHeader className="px-5 sm:px-6">
        <CardTitle className="text-base font-bold">Account</CardTitle>
        <CardDescription>
          Manage your password and end your session on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-5 sm:px-6">
        <AccountRow
          title="Password"
          description={
            passwordChanged ? (
              <span role="status" className="text-primary">
                Your password has been changed.
              </span>
            ) : (
              "Choose a strong password you don't use anywhere else."
            )
          }
        >
          <ChangePasswordDialog onChanged={() => setPasswordChanged(true)} />
        </AccountRow>

        <Separator />

        <AccountRow
          title="Sign out"
          description="You'll need your username and password to sign back in."
        >
          <Button
            variant="destructive"
            className="h-10 rounded-full px-4"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut aria-hidden="true" />
            {logoutMutation.isPending ? "Signing out…" : "Sign out"}
          </Button>
        </AccountRow>
      </CardContent>
    </Card>
  )
}

function AccountRow({
  title,
  description,
  children,
}: {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
