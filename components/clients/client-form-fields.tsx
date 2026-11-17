"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/** The fields as the inputs hold them, shared by the add and update forms. */
type ClientFieldValues = {
  name: string
  contactName: string
  email: string
  phone: string
}

type ClientFormFieldsProps = {
  register: UseFormRegister<ClientFieldValues>
  errors: FieldErrors<ClientFieldValues>
  /** Keeps input ids unique when more than one form is on the page. */
  idPrefix: string
  phoneOptional?: boolean
}

export function ClientFormFields({
  register,
  errors,
  idPrefix,
  phoneOptional = false,
}: ClientFormFieldsProps) {
  const id = (field: keyof ClientFieldValues) => `${idPrefix}-${field}`

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.name} className="sm:col-span-2">
        <FieldLabel htmlFor={id("name")}>Client name</FieldLabel>
        <Input
          id={id("name")}
          autoComplete="off"
          placeholder="e.g. Acme Developers Ltd"
          aria-invalid={!!errors.name}
          className={authInputClassName}
          {...register("name")}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.contactName} className="sm:col-span-2">
        <FieldLabel htmlFor={id("contactName")}>Contact person</FieldLabel>
        <Input
          id={id("contactName")}
          autoComplete="off"
          placeholder="e.g. Jane Wanjiku"
          aria-invalid={!!errors.contactName}
          className={authInputClassName}
          {...register("contactName")}
        />
        <FieldError>{errors.contactName?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor={id("email")}>Email</FieldLabel>
        <Input
          id={id("email")}
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder="e.g. name@company.co.ke"
          aria-invalid={!!errors.email}
          className={authInputClassName}
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.phone}>
        <FieldLabel htmlFor={id("phone")}>
          Phone
          {phoneOptional && (
            <>
              {" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </>
          )}
        </FieldLabel>
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
    </div>
  )
}
