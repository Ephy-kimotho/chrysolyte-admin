"use client"

import { UserAvatar } from "@/components/user-avatar"
import { UserActions } from "@/components/users/user-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsers } from "@/hooks/use-users"
import { getErrorMessage } from "@/lib/api/errors"
import {
  formatPhoneNumber,
  formatRole,
  formatShortDateTime,
  pluralize,
} from "@/lib/format"
import type { User } from "@/lib/types/users"

const headClassName =
  "h-10 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
const cellClassName = "px-3 py-3.5 align-middle whitespace-normal"

export function UsersTable() {
  const users = useUsers()

  return (
    <section
      aria-labelledby="all-users-heading"
      className="mt-2 flex flex-col gap-3"
    >
      <h3
        id="all-users-heading"
        className="font-heading text-lg font-semibold text-heading"
      >
        All users
      </h3>

      {users.isPending ? (
        <UsersSkeleton />
      ) : users.isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(users.error, "We couldn't load the users.")}
          </p>
          <Button
            variant="outline"
            onClick={() => users.refetch()}
            disabled={users.isFetching}
            className="h-10 rounded-full px-5"
          >
            {users.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : (
        <UsersList users={users.data} />
      )}
    </section>
  )
}

function UsersList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
        No users yet. Add one to give them access.
      </p>
    )
  }

  return (
    <>
      <p role="status" className="sr-only">
        {`${users.length} ${pluralize(users.length, "user", "users")}`}
      </p>

      {/* Wide screens: a table. */}
      <Card className="hidden rounded-2xl px-2 py-1 lg:flex">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headClassName}>User</TableHead>
              <TableHead className={headClassName}>Roles</TableHead>
              <TableHead className={headClassName}>Phone</TableHead>
              <TableHead className={headClassName}>Projects</TableHead>
              <TableHead className={headClassName}>Status</TableHead>
              <TableHead className={headClassName}>Last sign in</TableHead>
              <TableHead className={headClassName}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className={`${cellClassName} min-w-64`}>
                  <UserIdentity user={user} />
                </TableCell>
                <TableCell className={`${cellClassName} min-w-36`}>
                  <UserRoles roles={user.roles} />
                </TableCell>
                <TableCell
                  className={`${cellClassName} whitespace-nowrap tabular-nums`}
                >
                  <UserPhone phone={user.phone} />
                </TableCell>
                <TableCell className={`${cellClassName} min-w-36`}>
                  <UserProjects projectIds={user.projectIds} />
                </TableCell>
                <TableCell className={cellClassName}>
                  <UserStatusBadge user={user} />
                </TableCell>
                <TableCell
                  className={`${cellClassName} whitespace-nowrap tabular-nums`}
                >
                  <LastSignIn lastLoginAt={user.lastLoginAt} />
                </TableCell>
                <TableCell className={`${cellClassName} w-0 py-2.5`}>
                  <div className="flex justify-end">
                    <UserActions user={user} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Smaller screens: one card per user. */}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {users.map((user) => (
          <li key={user.id}>
            <Card className="h-full gap-4 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <UserIdentity user={user} />
                <div className="-mt-1 -mr-1 flex shrink-0 items-center gap-1">
                  <UserStatusBadge user={user} />
                  <UserActions user={user} />
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <dt className="text-xs text-muted-foreground">Roles</dt>
                  <dd>
                    <UserRoles roles={user.roles} />
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="whitespace-nowrap tabular-nums">
                    <UserPhone phone={user.phone} />
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Projects</dt>
                  <dd>
                    <UserProjects projectIds={user.projectIds} />
                  </dd>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">
                    Last sign in
                  </dt>
                  <dd className="tabular-nums">
                    <LastSignIn lastLoginAt={user.lastLoginAt} />
                  </dd>
                </div>
              </dl>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

function UserIdentity({ user }: { user: User }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={user.fullName} className="size-9 shrink-0 text-xs" />
      <div className="flex min-w-0 flex-col">
        <p className="font-semibold wrap-break-word">{user.fullName}</p>
        <p className="text-xs wrap-break-word text-muted-foreground">
          {user.email}
        </p>
      </div>
    </div>
  )
}

function UserRoles({ roles }: { roles: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <Badge key={role} variant="secondary">
          {formatRole(role)}
        </Badge>
      ))}
    </div>
  )
}

function UserPhone({ phone }: { phone: string | null }) {
  if (!phone) return <span className="text-muted-foreground">Not given</span>
  return formatPhoneNumber(phone)
}

/** Firm-wide users see every project; project-scoped ones list theirs. */
function UserProjects({ projectIds }: { projectIds: string[] }) {
  if (projectIds.length === 0) {
    return <span className="text-muted-foreground">All projects</span>
  }
  return (
    <ul className="flex flex-col gap-0.5 font-mono text-xs">
      {projectIds.map((id) => (
        <li key={id} className="wrap-break-word">
          {id}
        </li>
      ))}
    </ul>
  )
}

function UserStatusBadge({ user }: { user: User }) {
  if (user.isLocked) return <Badge variant="destructive">Locked</Badge>
  if (!user.active) return <Badge variant="warning">Inactive</Badge>
  return <Badge className="bg-primary/15 text-primary">Active</Badge>
}

function LastSignIn({ lastLoginAt }: { lastLoginAt: string | null }) {
  if (!lastLoginAt) return <span className="text-muted-foreground">Never</span>
  return formatShortDateTime(lastLoginAt)
}

const skeletonRows = [0, 1, 2, 3]

function UsersSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <p role="status" className="sr-only">
        Loading users…
      </p>

      <Card className="hidden gap-0 rounded-2xl px-5 py-2 lg:flex">
        {skeletonRows.map((row) => (
          <div
            key={row}
            className="flex items-center gap-6 border-b py-4 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="ml-auto h-4 w-32" />
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {skeletonRows.map((row) => (
          <Card key={row} className="gap-4 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
