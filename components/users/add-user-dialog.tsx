"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Plus, RefreshCw } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { CopyButton } from "@/components/copy-button"
import { UserRoleOptions } from "@/components/users/user-role-options"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateUser } from "@/hooks/use-create-user"
import { rolesQueryOptions } from "@/hooks/use-roles"
import { getErrorMessage } from "@/lib/api/errors"
import { generatePassword } from "@/lib/password"
import { createUserSchema } from "@/lib/schemas/users"
import { cn } from "@/lib/utils"
import type { CreateUserFormValues } from "@/lib/types/users"

const emptyValues: CreateUserFormValues = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  roles: [],
  password: "",
}

/** The sign-in details shown once the user is added. */
type CreatedUser = Pick<CreateUserFormValues, "fullName" | "email" | "password">

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null)
  const queryClient = useQueryClient()
  const createUser = useCreateUser()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: emptyValues,
  })
  const password = useWatch({ control, name: "password" })

  // Loads the roles while the pointer is on the button, so the list is
  // usually ready by the time the dialog opens.
  function prefetchRoles() {
    void queryClient.prefetchQuery(rolesQueryOptions)
  }

  // Every opening starts with an empty form, a fresh password and no
  // leftover error or confirmation.
  function handleOpenChange(nextOpen: boolean) {
    if (createUser.isPending) return
    if (nextOpen) reset({ ...emptyValues, password: generatePassword() })
    setOpen(nextOpen)
    if (!nextOpen) {
      createUser.reset()
      setCreatedUser(null)
    }
  }

  function onSubmit(data: CreateUserFormValues) {
    createUser.mutate(
      { data },
      {
        onSuccess: () =>
          setCreatedUser({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
          }),
      }
    )
  }

  const id = (field: string) => `add-user-${field}`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          onPointerEnter={prefetchRoles}
          onFocus={prefetchRoles}
          className="h-10 rounded-full px-4 font-semibold"
        >
          <Plus aria-hidden="true" />
          Add user
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        {createdUser ? (
          <UserCreated user={createdUser} />
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-lg font-bold text-heading">
                Add a user
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                Management users sign in with their email and password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {createUser.isError && (
                <p
                  role="alert"
                  className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
                >
                  {getErrorMessage(
                    createUser.error,
                    "We couldn't add the user. Try again."
                  )}
                </p>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field data-invalid={!!errors.fullName}>
                  <FieldLabel htmlFor={id("fullName")}>Full name</FieldLabel>
                  <Input
                    id={id("fullName")}
                    autoComplete="off"
                    placeholder="e.g. Jane Wanjiku"
                    aria-invalid={!!errors.fullName}
                    className={authInputClassName}
                    {...register("fullName")}
                  />
                  <FieldError>{errors.fullName?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.username}>
                  <FieldLabel htmlFor={id("username")}>Username</FieldLabel>
                  <Input
                    id={id("username")}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="e.g. jane.wanjiku"
                    aria-invalid={!!errors.username}
                    className={authInputClassName}
                    {...register("username")}
                  />
                  <FieldError>{errors.username?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor={id("email")}>Email</FieldLabel>
                  <Input
                    id={id("email")}
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="e.g. name@chrysolyte.co.ke"
                    aria-invalid={!!errors.email}
                    className={authInputClassName}
                    {...register("email")}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor={id("phone")}>Phone</FieldLabel>
                  <Input
                    id={id("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    placeholder="e.g. 0712 345 678"
                    aria-invalid={!!errors.phone}
                    className={authInputClassName}
                    {...register("phone")}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>

                <div className="sm:col-span-2">
                  <Controller
                    control={control}
                    name="roles"
                    render={({ field, fieldState }) => (
                      <UserRoleOptions
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        idPrefix="add-user"
                      />
                    )}
                  />
                </div>

                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor={id("password")}>
                    Temporary password
                  </FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id={id("password")}
                      readOnly
                      autoComplete="off"
                      spellCheck={false}
                      className={cn(authInputClassName, "min-w-0 font-mono")}
                      {...register("password")}
                    />
                    <CopyButton value={password} label="Copy password" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setValue("password", generatePassword())}
                      aria-label="Generate a new password"
                      className="size-11 shrink-0 rounded-xl"
                    >
                      <RefreshCw aria-hidden="true" />
                    </Button>
                  </div>
                  <FieldDescription>
                    Generated for you. They&apos;ll choose their own the first
                    time they sign in.
                  </FieldDescription>
                </Field>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={createUser.isPending}
                    className="h-10 rounded-full px-5"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={createUser.isPending}
                  className="h-10 rounded-full px-5"
                >
                  {createUser.isPending ? "Adding…" : "Add user"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Confirms the new user and shows the details to pass on to them. */
function UserCreated({ user }: { user: CreatedUser }) {
  const details = [
    { label: "Email", value: user.email },
    { label: "Temporary password", value: user.password, mono: true },
  ]

  return (
    <>
      <DialogHeader className="pr-8">
        <DialogTitle className="text-lg font-bold text-heading">
          {user.fullName} has been added
        </DialogTitle>
        <DialogDescription className="leading-relaxed">
          Share these sign-in details with them. This is the only time the
          password is shown.
        </DialogDescription>
      </DialogHeader>

      <dl className="flex flex-col gap-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 rounded-xl border bg-background/60 py-2 pr-2 pl-3.5"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{detail.label}</dt>
              <dd
                className={cn(
                  "text-sm font-medium wrap-break-word text-foreground",
                  detail.mono && "font-mono"
                )}
              >
                {detail.value}
              </dd>
            </div>
            <CopyButton
              value={detail.value}
              label={`Copy ${detail.label.toLowerCase()}`}
              className="size-10"
            />
          </div>
        ))}
      </dl>

      <div className="flex justify-end">
        <DialogClose asChild>
          <Button className="h-10 w-full rounded-full px-5 sm:w-auto">
            Done
          </Button>
        </DialogClose>
      </div>
    </>
  )
}
