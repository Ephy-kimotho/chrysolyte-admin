"use client"

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
import { StaffCombobox } from "@/components/projects/staff-combobox"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
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
  designStages,
  type DesignDeliverableFormValues,
} from "@/lib/types/design"
import { instructionDisciplines } from "@/lib/types/projects"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

type DesignDeliverableFormFieldsProps = {
  control: Control<DesignDeliverableFormValues>
  register: UseFormRegister<DesignDeliverableFormValues>
  errors: FieldErrors<DesignDeliverableFormValues>
  /** Keeps field ids unique between the add and update forms. */
  idPrefix: string
  /**
   * `create` lets the project be chosen. `update` keeps the deliverable on its
   * project and adds the client approval checkbox.
   */
  variant: "create" | "update"
}

type SelectFieldName = "projectId" | "discipline" | "stage"

/** The fields shared by the add and update deliverable forms. */
export function DesignDeliverableFormFields({
  control,
  register,
  errors,
  idPrefix,
  variant,
}: DesignDeliverableFormFieldsProps) {
  const { data: projects = [] } = useProjects()

  function renderSelect(
    name: SelectFieldName,
    placeholder: string,
    options: readonly { value: string; label: string }[],
    disabled = false
  ) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            name={field.name}
            // "" shows the placeholder again after the form resets.
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={`${idPrefix}-${name}`}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={!!errors[name]}
              className={selectTriggerClassName}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="popper">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  const asOptions = (values: readonly string[]) =>
    values.map((value) => ({ value, label: value }))

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.projectId}>
        <FieldLabel htmlFor={`${idPrefix}-projectId`}>Project</FieldLabel>
        {renderSelect(
          "projectId",
          "Choose a project",
          projects.map((project) => ({
            value: project.id,
            label: project.name,
          })),
          variant === "update"
        )}
        {variant === "update" && (
          <FieldDescription>
            A deliverable stays with the project it was added to.
          </FieldDescription>
        )}
        <FieldError>{errors.projectId?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.discipline}>
        <FieldLabel htmlFor={`${idPrefix}-discipline`}>Discipline</FieldLabel>
        {renderSelect(
          "discipline",
          "Choose the discipline",
          asOptions(instructionDisciplines)
        )}
        <FieldError>{errors.discipline?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.stage}>
        <FieldLabel htmlFor={`${idPrefix}-stage`}>Stage</FieldLabel>
        {renderSelect("stage", "Choose the stage", asOptions(designStages))}
        <FieldError>{errors.stage?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.deliverable}>
        <FieldLabel htmlFor={`${idPrefix}-deliverable`}>Deliverable</FieldLabel>
        <Input
          id={`${idPrefix}-deliverable`}
          autoComplete="off"
          placeholder="e.g. Floor plans"
          aria-invalid={!!errors.deliverable}
          className={authInputClassName}
          {...register("deliverable")}
        />
        <FieldError>{errors.deliverable?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.leadId}>
        <FieldLabel htmlFor={`${idPrefix}-lead`}>Lead</FieldLabel>
        <Controller
          control={control}
          name="leadId"
          render={({ field }) => (
            <StaffCombobox
              id={`${idPrefix}-lead`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              aria-invalid={!!errors.leadId}
            />
          )}
        />
        <FieldError>{errors.leadId?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.reviewerId}>
        <FieldLabel htmlFor={`${idPrefix}-reviewer`}>Reviewer</FieldLabel>
        <Controller
          control={control}
          name="reviewerId"
          render={({ field }) => (
            <StaffCombobox
              id={`${idPrefix}-reviewer`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              aria-invalid={!!errors.reviewerId}
            />
          )}
        />
        <FieldError>{errors.reviewerId?.message}</FieldError>
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

      {variant === "update" && (
        <Controller
          control={control}
          name="clientApproved"
          render={({ field }) => (
            <FieldLabel
              htmlFor={`${idPrefix}-client-approved`}
              className="rounded-xl sm:col-span-2"
            >
              <Field orientation="horizontal" className="p-3!">
                <Checkbox
                  id={`${idPrefix}-client-approved`}
                  ref={field.ref}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  onBlur={field.onBlur}
                />
                <FieldContent>
                  <FieldTitle>Approved by the client</FieldTitle>
                  <FieldDescription className="text-xs">
                    Leave it unticked while the client is still reviewing.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          )}
        />
      )}
    </div>
  )
}
