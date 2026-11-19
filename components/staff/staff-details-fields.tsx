"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  staffDivisions,
  staffEmploymentTypes,
  staffHealthStatuses,
  type StaffDetailsFormInput,
} from "@/lib/types/staff"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

type StaffDetailsFieldsProps = {
  /** Keeps input ids unique when more than one form is on the page. */
  idPrefix: string
  /** False for the update form: the ID number can't change once added. */
  showIdNo?: boolean
}

/**
 * The staff details shared by the add and update forms, as grid items for a
 * two-column grid. Return to work only shows when the health status isn't Fit.
 * Render it inside a `FormProvider`. The add form's extra photo field and the
 * update form's missing ID number and extra active switch are both fine.
 */
export function StaffDetailsFields({
  idPrefix,
  showIdNo = true,
}: StaffDetailsFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<StaffDetailsFormInput>()
  const id = (field: string) => `${idPrefix}-${field}`
  const health = useWatch({ control, name: "health" })
  const asksReturnToWork = health !== undefined && health !== "Fit"

  return (
    <>
      <Field data-invalid={!!errors.fullName}>
        <FieldLabel htmlFor={id("full-name")}>Full name</FieldLabel>
        <Input
          id={id("full-name")}
          autoComplete="off"
          placeholder="e.g. Peter Mwangi"
          aria-invalid={!!errors.fullName}
          className={authInputClassName}
          {...register("fullName")}
        />
        <FieldError>{errors.fullName?.message}</FieldError>
      </Field>

      {showIdNo && (
        <Field data-invalid={!!errors.idNo}>
          <FieldLabel htmlFor={id("id-no")}>ID number</FieldLabel>
          <Input
            id={id("id-no")}
            autoComplete="off"
            placeholder="e.g. 12345678"
            aria-invalid={!!errors.idNo}
            className={`${authInputClassName} uppercase placeholder:normal-case`}
            {...register("idNo")}
          />
          <FieldError>{errors.idNo?.message}</FieldError>
        </Field>
      )}

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

      <Field data-invalid={!!errors.division}>
        <FieldLabel htmlFor={id("division")}>Division</FieldLabel>
        <Controller
          control={control}
          name="division"
          render={({ field }) => (
            <Select
              name={field.name}
              // "" shows the placeholder again after the form resets.
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id("division")}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.division}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose a division" />
              </SelectTrigger>
              <SelectContent position="popper">
                {staffDivisions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.division?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.role}>
        <FieldLabel htmlFor={id("role")}>Role</FieldLabel>
        <Input
          id={id("role")}
          autoComplete="off"
          placeholder="e.g. Site Supervisor"
          aria-invalid={!!errors.role}
          className={authInputClassName}
          {...register("role")}
        />
        <FieldError>{errors.role?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.employmentType}>
        <FieldLabel htmlFor={id("employment-type")}>Employment type</FieldLabel>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id("employment-type")}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.employmentType}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose an employment type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {staffEmploymentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.employmentType?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.dailyRate}>
        <FieldLabel htmlFor={id("daily-rate")}>Daily rate (KES)</FieldLabel>
        <Input
          id={id("daily-rate")}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="e.g. 2500"
          aria-invalid={!!errors.dailyRate}
          className={authInputClassName}
          {...register("dailyRate", { valueAsNumber: true })}
        />
        <FieldError>{errors.dailyRate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.startDate}>
        <FieldLabel htmlFor={id("start-date")}>Start date</FieldLabel>
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              id={id("start-date")}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Choose the start date"
              aria-invalid={!!errors.startDate}
            />
          )}
        />
        <FieldError>{errors.startDate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.health}>
        <FieldLabel htmlFor={id("health")}>Health</FieldLabel>
        <Controller
          control={control}
          name="health"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id("health")}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.health}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose a health status" />
              </SelectTrigger>
              <SelectContent position="popper">
                {staffHealthStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.health?.message}</FieldError>
      </Field>

      {asksReturnToWork && (
        <Field data-invalid={!!errors.returnToWork}>
          <FieldLabel htmlFor={id("return-to-work")}>Return to work</FieldLabel>
          <Controller
            control={control}
            name="returnToWork"
            render={({ field }) => (
              <DatePicker
                id={id("return-to-work")}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose the return date"
                aria-invalid={!!errors.returnToWork}
              />
            )}
          />
          <FieldError>{errors.returnToWork?.message}</FieldError>
        </Field>
      )}
    </>
  )
}
