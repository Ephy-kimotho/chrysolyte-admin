"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { storeAddButtonClassName } from "@/components/stores/store-card"
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateEquipment } from "@/hooks/use-create-equipment"
import { useProjects } from "@/hooks/use-projects"
import { createEquipmentSchema } from "@/lib/schemas/stores"
import {
  equipmentCategories,
  equipmentConditions,
  type CreateEquipmentFormValues,
} from "@/lib/types/stores"

// Radix Select items can't have an empty value, so the general store gets its own.
const generalStoreValue = "general-store"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

// Category must be chosen; new equipment usually starts in good condition.
const defaultValues: DefaultValues<CreateEquipmentFormValues> = {
  item: "",
  quantity: 1,
  condition: "Good",
  assignedProjectId: null,
}

export function AddEquipmentDialog() {
  const [open, setOpen] = useState(false)
  const createEquipment = useCreateEquipment()
  const { data: projects } = useProjects()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEquipmentFormValues>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createEquipment.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createEquipment.reset()
    }
  }

  function onSubmit(data: CreateEquipmentFormValues) {
    createEquipment.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={storeAddButtonClassName}>
          <Plus aria-hidden="true" />
          Equipment
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add equipment or tools
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Assign it to a project, or keep it in the general store.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createEquipment.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the equipment. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.item}>
              <FieldLabel htmlFor="equipment-item">Item</FieldLabel>
              <Input
                id="equipment-item"
                autoComplete="off"
                placeholder="e.g. Concrete mixer"
                aria-invalid={!!errors.item}
                className={authInputClassName}
                {...register("item")}
              />
              <FieldError>{errors.item?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="equipment-category">Category</FieldLabel>
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
                      id="equipment-category"
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

            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor="equipment-quantity">Quantity</FieldLabel>
              <Input
                id="equipment-quantity"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                aria-invalid={!!errors.quantity}
                className={authInputClassName}
                {...register("quantity", { valueAsNumber: true })}
              />
              <FieldError>{errors.quantity?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.condition}>
              <FieldLabel htmlFor="equipment-condition">Condition</FieldLabel>
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
                      id="equipment-condition"
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

            <Field
              data-invalid={!!errors.assignedProjectId}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="equipment-assigned">Assigned to</FieldLabel>
              <Controller
                control={control}
                name="assignedProjectId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? generalStoreValue}
                    onValueChange={(value) =>
                      field.onChange(value === generalStoreValue ? null : value)
                    }
                  >
                    <SelectTrigger
                      id="equipment-assigned"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.assignedProjectId}
                      className={selectTriggerClassName}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value={generalStoreValue}>
                        General store
                      </SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.code} · {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.assignedProjectId?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createEquipment.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createEquipment.isPending}
              className="h-10 rounded-full px-5"
            >
              {createEquipment.isPending ? "Adding…" : "Add equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
