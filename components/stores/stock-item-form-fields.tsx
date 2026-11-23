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
  stockUnitSuggestions,
  type CreateStockItemFormValues,
} from "@/lib/types/stores"

type StockItemFormFieldsProps = {
  control: Control<CreateStockItemFormValues>
  register: UseFormRegister<CreateStockItemFormValues>
  errors: FieldErrors<CreateStockItemFormValues>
  /** Keeps field ids unique between the add and update forms. */
  idPrefix: string
}

/** The fields shared by the add and update stock item forms. */
export function StockItemFormFields({
  control,
  register,
  errors,
  idPrefix,
}: StockItemFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors.item}>
        <FieldLabel htmlFor={`${idPrefix}-item`}>Item</FieldLabel>
        <Input
          id={`${idPrefix}-item`}
          autoComplete="off"
          placeholder="e.g. Cement"
          aria-invalid={!!errors.item}
          className={authInputClassName}
          {...register("item")}
        />
        <FieldError>{errors.item?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.supplier}>
        <FieldLabel htmlFor={`${idPrefix}-supplier`}>Supplier</FieldLabel>
        <Input
          id={`${idPrefix}-supplier`}
          autoComplete="off"
          placeholder="e.g. Bamburi Cement"
          aria-invalid={!!errors.supplier}
          className={authInputClassName}
          {...register("supplier")}
        />
        <FieldError>{errors.supplier?.message}</FieldError>
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
              suggestions={stockUnitSuggestions}
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
          placeholder="e.g. 56"
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
          placeholder="e.g. 60"
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
