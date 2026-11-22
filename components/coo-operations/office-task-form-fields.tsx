"use client"

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
import { ProjectCombobox } from "@/components/projects/project-combobox"
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
import { Textarea } from "@/components/ui/textarea"
import {
  officeTaskCategories,
  type CreateOfficeTaskFormValues,
} from "@/lib/types/coo-operations"

type OfficeTaskFormFieldsProps = {
  control: Control<CreateOfficeTaskFormValues>
  register: UseFormRegister<CreateOfficeTaskFormValues>
  errors: FieldErrors<CreateOfficeTaskFormValues>
  /** Keeps field ids unique between the add and update forms. */
  idPrefix: string
  /** Shows the project without letting it change, e.g. when updating. */
  projectReadOnly?: boolean
}

/** The fields shared by the add and update office task forms. */
export function OfficeTaskFormFields({
  control,
  register,
  errors,
  idPrefix,
  projectReadOnly = false,
}: OfficeTaskFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <Field data-invalid={!!errors.task}>
        <FieldLabel htmlFor={`${idPrefix}-task`}>Task</FieldLabel>
        <Input
          id={`${idPrefix}-task`}
          autoComplete="off"
          placeholder="e.g. Prepare weekly project cost report"
          aria-invalid={!!errors.task}
          className={authInputClassName}
          {...register("task")}
        />
        <FieldError>{errors.task?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.projectId}>
        <FieldLabel htmlFor={`${idPrefix}-project`}>Project</FieldLabel>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <ProjectCombobox
              id={`${idPrefix}-project`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              disabled={projectReadOnly}
              aria-invalid={!!errors.projectId}
            />
          )}
        />
        {projectReadOnly && (
          <FieldDescription>
            A task stays with the project it was added to.
          </FieldDescription>
        )}
        <FieldError>{errors.projectId?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.category}>
          <FieldLabel htmlFor={`${idPrefix}-category`}>Category</FieldLabel>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                name={field.name}
                // "" shows the placeholder again after the form resets.
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={`${idPrefix}-category`}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.category}
                  className="h-11! w-full rounded-xl bg-background/60 px-3.5"
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {officeTaskCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.category?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.owner}>
          <FieldLabel htmlFor={`${idPrefix}-owner`}>Owner</FieldLabel>
          <Input
            id={`${idPrefix}-owner`}
            autoComplete="off"
            placeholder="e.g. Anne Wambui"
            aria-invalid={!!errors.owner}
            className={authInputClassName}
            {...register("owner")}
          />
          <FieldError>{errors.owner?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.deadline}>
          <FieldLabel htmlFor={`${idPrefix}-deadline`}>Deadline</FieldLabel>
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DatePicker
                id={`${idPrefix}-deadline`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose the deadline"
                aria-invalid={!!errors.deadline}
              />
            )}
          />
          <FieldError>{errors.deadline?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.progress}>
          <FieldLabel htmlFor={`${idPrefix}-progress`}>Progress (%)</FieldLabel>
          <Input
            id={`${idPrefix}-progress`}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={1}
            aria-invalid={!!errors.progress}
            className={authInputClassName}
            {...register("progress", { valueAsNumber: true })}
          />
          <FieldError>{errors.progress?.message}</FieldError>
        </Field>
      </div>

      <Field data-invalid={!!errors.notes}>
        <FieldLabel htmlFor={`${idPrefix}-notes`}>
          Notes{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </FieldLabel>
        <Textarea
          id={`${idPrefix}-notes`}
          placeholder="e.g. Waiting on the client's PO number."
          aria-invalid={!!errors.notes}
          className="max-h-48 min-h-20 rounded-xl bg-background/60 px-3.5 py-2.5"
          {...register("notes")}
        />
        <FieldError>{errors.notes?.message}</FieldError>
      </Field>
    </div>
  )
}
