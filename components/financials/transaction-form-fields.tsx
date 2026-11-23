"use client"

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProjects } from "@/hooks/use-projects"
import {
  transactionTypeLabels,
  transactionTypes,
  type CreateTransactionFormValues,
} from "@/lib/types/financials"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

type TransactionFormFieldsProps = {
  control: Control<CreateTransactionFormValues>
  register: UseFormRegister<CreateTransactionFormValues>
  errors: FieldErrors<CreateTransactionFormValues>
  /** Keeps field ids unique between the record and update forms. */
  idPrefix: string
  /** Shows the project without letting it change, e.g. when updating. */
  projectReadOnly?: boolean
}

/** The fields shared by the record and update transaction forms. */
export function TransactionFormFields({
  control,
  register,
  errors,
  idPrefix,
  projectReadOnly = false,
}: TransactionFormFieldsProps) {
  const { data: projects = [] } = useProjects()

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.type}>
        <FieldLabel htmlFor={`${idPrefix}-type`}>Type</FieldLabel>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              name={field.name}
              // "" shows the placeholder again after the form resets.
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={`${idPrefix}-type`}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.type}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose a type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {transactionTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.type?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.projectId}>
        <FieldLabel htmlFor={`${idPrefix}-project`}>Project</FieldLabel>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={projectReadOnly}
            >
              <SelectTrigger
                id={`${idPrefix}-project`}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.projectId}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent position="popper">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {projectReadOnly && (
          <FieldDescription>
            A transaction stays with the project it was recorded against.
          </FieldDescription>
        )}
        <FieldError>{errors.projectId?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.amount}>
        <FieldLabel htmlFor={`${idPrefix}-amount`}>Amount (KES)</FieldLabel>
        <Input
          id={`${idPrefix}-amount`}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="e.g. 250000"
          aria-invalid={!!errors.amount}
          className={authInputClassName}
          {...register("amount", { valueAsNumber: true })}
        />
        <FieldError>{errors.amount?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.date}>
        <FieldLabel htmlFor={`${idPrefix}-date`}>Date</FieldLabel>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              id={`${idPrefix}-date`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              maxDate={new Date()}
              placeholder="Choose the date"
              aria-invalid={!!errors.date}
            />
          )}
        />
        <FieldError>{errors.date?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.description} className="sm:col-span-2">
        <FieldLabel htmlFor={`${idPrefix}-description`}>Description</FieldLabel>
        <Input
          id={`${idPrefix}-description`}
          autoComplete="off"
          placeholder="e.g. Cement and reinforcement"
          aria-invalid={!!errors.description}
          className={authInputClassName}
          {...register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </Field>
    </div>
  )
}
