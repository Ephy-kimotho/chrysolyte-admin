"use client"

import { parseISO } from "date-fns"
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import { StaffCombobox } from "@/components/projects/staff-combobox"
import { Button } from "@/components/ui/button"
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
  equipmentCategories,
  equipmentConditions,
  type CreateEquipmentFormValues,
} from "@/lib/types/stores"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

const textareaClassName =
  "max-h-48 min-h-24 rounded-xl bg-background/60 px-3.5 py-2.5"

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}{" "}
      <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  )
}

type EquipmentFormFieldsProps = {
  control: Control<CreateEquipmentFormValues>
  register: UseFormRegister<CreateEquipmentFormValues>
  errors: FieldErrors<CreateEquipmentFormValues>
  /** Keeps field ids unique between the add and update forms. */
  idPrefix: string
}

/** The fields shared by the add and update equipment forms. */
export function EquipmentFormFields({
  control,
  register,
  errors,
  idPrefix,
}: EquipmentFormFieldsProps) {
  const issuedDate = useWatch({ control, name: "issuedDate" })

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.assetNumber}>
        <FieldLabel htmlFor={`${idPrefix}-asset-number`}>
          Asset number
        </FieldLabel>
        <Input
          id={`${idPrefix}-asset-number`}
          autoComplete="off"
          placeholder="e.g. EQ-0042"
          aria-invalid={!!errors.assetNumber}
          className={authInputClassName}
          {...register("assetNumber")}
        />
        <FieldError>{errors.assetNumber?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.item}>
        <FieldLabel htmlFor={`${idPrefix}-item`}>Item</FieldLabel>
        <Input
          id={`${idPrefix}-item`}
          autoComplete="off"
          placeholder="e.g. Concrete mixer"
          aria-invalid={!!errors.item}
          className={authInputClassName}
          {...register("item")}
        />
        <FieldError>{errors.item?.message}</FieldError>
      </Field>

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
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent position="popper">
                {equipmentCategories.map((category) => (
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

      <Field data-invalid={!!errors.condition}>
        <FieldLabel htmlFor={`${idPrefix}-condition`}>Condition</FieldLabel>
        <Controller
          control={control}
          name="condition"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={`${idPrefix}-condition`}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.condition}
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Choose the condition" />
              </SelectTrigger>
              <SelectContent position="popper">
                {equipmentConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.condition?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.qty}>
        <FieldLabel htmlFor={`${idPrefix}-qty`}>Quantity</FieldLabel>
        <Input
          id={`${idPrefix}-qty`}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          aria-invalid={!!errors.qty}
          className={authInputClassName}
          {...register("qty", { valueAsNumber: true })}
        />
        <FieldError>{errors.qty?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.purchaseCost}>
        <FieldLabel htmlFor={`${idPrefix}-purchase-cost`}>
          <OptionalLabel>Purchase cost (KES)</OptionalLabel>
        </FieldLabel>
        <Input
          id={`${idPrefix}-purchase-cost`}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="e.g. 185000"
          aria-invalid={!!errors.purchaseCost}
          className={authInputClassName}
          {...register("purchaseCost", {
            // Blank means not given, rather than 0.
            setValueAs: (value: string) =>
              value === "" ? null : Number(value),
          })}
        />
        <FieldError>{errors.purchaseCost?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.assignedProjectId}>
        <FieldLabel htmlFor={`${idPrefix}-assigned`}>
          <OptionalLabel>Assigned to</OptionalLabel>
        </FieldLabel>
        <Controller
          control={control}
          name="assignedProjectId"
          render={({ field }) => (
            <ProjectCombobox
              id={`${idPrefix}-assigned`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              placeholder="General store"
              clearable
              aria-invalid={!!errors.assignedProjectId}
            />
          )}
        />
        <FieldDescription className="text-xs">
          Leave it blank to keep it in the general store.
        </FieldDescription>
        <FieldError>{errors.assignedProjectId?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.responsibleId}>
        <FieldLabel htmlFor={`${idPrefix}-responsible`}>
          Responsible person
        </FieldLabel>
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

      <Field data-invalid={!!errors.issuedDate}>
        <FieldLabel htmlFor={`${idPrefix}-issued-date`}>Issue date</FieldLabel>
        <Controller
          control={control}
          name="issuedDate"
          render={({ field }) => (
            <DatePicker
              id={`${idPrefix}-issued-date`}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Choose the issue date"
              aria-invalid={!!errors.issuedDate}
            />
          )}
        />
        <FieldError>{errors.issuedDate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.returnDate}>
        <FieldLabel htmlFor={`${idPrefix}-return-date`}>
          <OptionalLabel>Return date</OptionalLabel>
        </FieldLabel>
        <Controller
          control={control}
          name="returnDate"
          render={({ field }) => (
            <>
              <DatePicker
                id={`${idPrefix}-return-date`}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose the return date"
                minDate={issuedDate ? parseISO(issuedDate) : undefined}
                aria-invalid={!!errors.returnDate}
              />
              {field.value && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => field.onChange("")}
                  className="h-auto w-fit p-0 text-xs text-muted-foreground"
                >
                  Clear return date
                </Button>
              )}
            </>
          )}
        />
        <FieldError>{errors.returnDate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.maintenanceNotes} className="sm:col-span-2">
        <FieldLabel htmlFor={`${idPrefix}-maintenance-notes`}>
          <OptionalLabel>Maintenance notes</OptionalLabel>
        </FieldLabel>
        <Textarea
          id={`${idPrefix}-maintenance-notes`}
          placeholder="e.g. Serviced in October, next service due after 200 hours"
          aria-invalid={!!errors.maintenanceNotes}
          className={textareaClassName}
          {...register("maintenanceNotes")}
        />
        <FieldError>{errors.maintenanceNotes?.message}</FieldError>
      </Field>
    </div>
  )
}
