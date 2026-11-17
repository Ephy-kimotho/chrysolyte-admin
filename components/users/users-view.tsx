import { AddUserDialog } from "@/components/users/add-user-dialog"
import { UserRoleStats } from "@/components/users/user-role-stats"
import { UsersTable } from "@/components/users/users-table"

export function UsersView() {
  return (
    <section aria-labelledby="users-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="users-heading"
            className="font-heading text-xl font-bold text-heading"
          >
            Users
          </h2>
          <p className="text-sm text-muted-foreground">
            Everyone who can sign in to FirmControl, by role.
          </p>
        </div>
        <AddUserDialog />
      </div>

      <UserRoleStats />
      <UsersTable />
    </section>
  )
}
