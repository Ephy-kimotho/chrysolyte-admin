"use client"

import { parseISO } from "date-fns"
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { DatePicker } from "@/components/date-picker"
import { StaffCombobox } from "@/components/projects/staff-combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/format"
import {
  instructionDisciplines,
  type ProjectInstructionFormValues,
} from "@/lib/types/projects"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

type ProjectInstructionFormFieldsProps = {
  control: Control<ProjectInstructionFormValues>
  register: UseFormRegister<ProjectInstructionFormValues>
  errors: FieldErrors<ProjectInstructionFormValues>
  /** Keeps field ids unique between the add and update forms. */
  idPrefix: string
  /**
   * `create` asks for the date issued. `update` can't change that date, so it
   * asks for the response instead.
   */
  variant: "create" | "update"
}

/** The fields shared by the add and update instruction forms. */
export function ProjectInstructionFormFields({
  control,
  register,
  errors,
  idPrefix,
  variant,
}: ProjectInstructionFormFieldsProps) {
  // The deadline picker can't go earlier than the issue date.
  const issueDate = useWatch({ control, name: "issueDate" })

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.discipline}>
        <FieldLabel htmlFor={`${idPrefix}-discipline`}>Discipline</FieldLabel>
        <Controller
          control={control}
          name="discipline"
          render={({ field }) => (
            <Select
              name={field.name}
              // "" shows the placeholder again after the form resets.
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={`${idPrefix}-discipline`}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.discipline}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose the discipline" />
              </SelectTrigger>
              <SelectContent position="popper">
                {instructionDisciplines.map((discipline) => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.discipline?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.responsibleId}>
        <FieldLabel htmlFor={`${idPrefix}-responsible`}>Responsible</FieldLabel>
        <Controller
          control={control}
          name="responsibleId"
          render={({ field }) => (
            <StaffCombobox
              id={`${idPrefix}-responsible`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              aria-invalid={!!errors.responsibleId}
            />
          )}
        />
        <FieldError>{errors.responsibleId?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.instruction} className="sm:col-span-2">
        <FieldLabel htmlFor={`${idPrefix}-text`}>Instruction</FieldLabel>
        <Textarea
          id={`${idPrefix}-text`}
          placeholder="e.g. Revise the window opening at Grid B3 to match the approved architectural detail."
          aria-invalid={!!errors.instruction}
          className="max-h-60 min-h-28 rounded-xl bg-background/60 px-3.5 py-2.5"
          {...register("instruction")}
        />
        <FieldError>{errors.instruction?.message}</FieldError>
      </Field>

      {variant === "create" && (
        <Field data-invalid={!!errors.issueDate}>
          <FieldLabel htmlFor={`${idPrefix}-issue-date`}>
            Date issued
          </FieldLabel>
          <Controller
            control={control}
            name="issueDate"
            render={({ field }) => (
              <DatePicker
                id={`${idPrefix}-issue-date`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                maxDate={new Date()}
                placeholder="Choose the date"
                aria-invalid={!!errors.issueDate}
              />
            )}
          />
          <FieldError>{errors.issueDate?.message}</FieldError>
        </Field>
      )}

      <Field
        data-invalid={!!errors.deadline}
        // Without the date issued beside it, it's alone on its row.
        className={variant === "update" ? "sm:col-span-2" : undefined}
      >
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
              minDate={issueDate ? parseISO(issueDate) : undefined}
              placeholder="Choose the deadline"
              aria-invalid={!!errors.deadline}
            />
          )}
        />
        {variant === "update" && issueDate && (
          <FieldDescription>Issued {formatDate(issueDate)}.</FieldDescription>
        )}
        <FieldError>{errors.deadline?.message}</FieldError>
      </Field>

      {variant === "update" && (
        <Field data-invalid={!!errors.response} className="sm:col-span-2">
          <FieldLabel htmlFor={`${idPrefix}-response`}>
            Response{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </FieldLabel>
          <Textarea
            id={`${idPrefix}-response`}
            placeholder="e.g. Window opening revised and checked against the approved detail."
            aria-invalid={!!errors.response}
            className="max-h-60 min-h-24 rounded-xl bg-background/60 px-3.5 py-2.5"
            {...register("response")}
          />
          <FieldError>{errors.response?.message}</FieldError>
        </Field>
      )}
    </div>
  )
}
