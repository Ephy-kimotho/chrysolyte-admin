"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { useRoles } from "@/hooks/use-roles"
import { getErrorMessage } from "@/lib/api/errors"

/** The roles this form can give, in the order they're listed. */
const assignableRoles = ["director", "accountant", "office", "design"]

type UserRoleOptionsProps = {
  /** Ticked role names, in the order they were ticked. */
  value: string[]
  onChange: (roles: string[]) => void
  error?: string
  idPrefix: string
}

/** A checkbox card per management role, showing its label and description. */
export function UserRoleOptions({
  value,
  onChange,
  error,
  idPrefix,
}: UserRoleOptionsProps) {
  const roles = useRoles()

  const options = (roles.data ?? [])
    .filter((role) => role.isActive && assignableRoles.includes(role.name))
    .sort(
      (a, b) =>
        assignableRoles.indexOf(a.name) - assignableRoles.indexOf(b.name)
    )

  function toggle(name: string, checked: boolean) {
    onChange(
      checked ? [...value, name] : value.filter((roleName) => roleName !== name)
    )
  }

  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label" className="mb-0">
        Roles
      </FieldLegend>

      {roles.isPending ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" aria-hidden>
          {assignableRoles.map((name) => (
            <Skeleton key={name} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : roles.isError ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-xl border border-dashed px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(roles.error, "We couldn't load the roles.")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => roles.refetch()}
            disabled={roles.isFetching}
            className="h-9 rounded-full px-4"
          >
            {roles.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {options.map((role) => {
            const id = `${idPrefix}-role-${role.name}`
            return (
              <FieldLabel key={role.name} htmlFor={id} className="rounded-xl">
                <Field orientation="horizontal" className="p-3!">
                  <Checkbox
                    id={id}
                    checked={value.includes(role.name)}
                    onCheckedChange={(checked) =>
                      toggle(role.name, checked === true)
                    }
                    aria-invalid={!!error}
                  />
                  <FieldContent>
                    <FieldTitle>{role.label}</FieldTitle>
                    <FieldDescription className="text-xs">
                      {role.description}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            )
          })}
        </div>
      )}

      <FieldError>{error}</FieldError>
    </FieldSet>
  )
}
