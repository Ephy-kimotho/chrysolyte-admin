"use client"

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { UnitInput } from "@/components/stores/unit-input"
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
import {
  welfareCategories,
  welfareUnitSuggestions,
  type CreateWelfareItemFormValues,
} from "@/lib/types/stores"

type WelfareItemFormFieldsProps = {
  control: Control<CreateWelfareItemFormValues>
  register: UseFormRegister<CreateWelfareItemFormValues>
  errors: FieldErrors<CreateWelfareItemFormValues>
  /** Keeps field ids unique between forms. */
  idPrefix: string
}

/** The fields of a welfare store item form. */
export function WelfareItemFormFields({
  control,
  register,
  errors,
  idPrefix,
}: WelfareItemFormFieldsProps) {
  return (
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
                {welfareCategories.map((category) => (
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

      <Field data-invalid={!!errors.item}>
        <FieldLabel htmlFor={`${idPrefix}-item`}>Item</FieldLabel>
        <Input
          id={`${idPrefix}-item`}
          autoComplete="off"
          placeholder="e.g. Maize flour"
          aria-invalid={!!errors.item}
          className={authInputClassName}
          {...register("item")}
        />
        <FieldError>{errors.item?.message}</FieldError>
      </Field>

      <Controller
        control={control}
        name="unit"
        render={({ field }) => (
          <Field data-invalid={!!errors.unit} className="sm:col-span-2">
            <FieldLabel htmlFor={`${idPrefix}-unit`}>Unit</FieldLabel>
            <UnitInput
              id={`${idPrefix}-unit`}
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              suggestions={welfareUnitSuggestions}
              aria-invalid={!!errors.unit}
            />
            <FieldDescription className="text-xs">
              What the quantities are counted in.
            </FieldDescription>
            <FieldError>{errors.unit?.message}</FieldError>
          </Field>
        )}
      />

      <Field data-invalid={!!errors.qty}>
        <FieldLabel htmlFor={`${idPrefix}-qty`}>Quantity</FieldLabel>
        <Input
          id={`${idPrefix}-qty`}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="e.g. 45"
          aria-invalid={!!errors.qty}
          className={authInputClassName}
          {...register("qty", { valueAsNumber: true })}
        />
        <FieldError>{errors.qty?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.minQty}>
        <FieldLabel htmlFor={`${idPrefix}-min-qty`}>
          Minimum quantity
        </FieldLabel>
        <Input
          id={`${idPrefix}-min-qty`}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="e.g. 20"
          aria-invalid={!!errors.minQty}
          className={authInputClassName}
          {...register("minQty", { valueAsNumber: true })}
        />
        <FieldDescription className="text-xs">
          Restock when the quantity drops below this.
        </FieldDescription>
        <FieldError>{errors.minQty?.message}</FieldError>
      </Field>
    </div>
  )
}
