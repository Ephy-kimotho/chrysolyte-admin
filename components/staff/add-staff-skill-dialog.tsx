"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
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
import { useCreateStaffSkill } from "@/hooks/use-create-staff-skill"
import { getErrorMessage } from "@/lib/api/errors"
import { createStaffSkillSchema } from "@/lib/schemas/staff"
import type { CreateStaffSkillFormValues } from "@/lib/types/staff"

const defaultValues: CreateStaffSkillFormValues = {
  category: "",
  skill: "",
  description: "",
}

type AddStaffSkillDialogProps = {
  staffId: string
  staffName: string
}

export function AddStaffSkillDialog({
  staffId,
  staffName,
}: AddStaffSkillDialogProps) {
  const [open, setOpen] = useState(false)
  const createSkill = useCreateStaffSkill()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffSkillFormValues>({
    resolver: zodResolver(createStaffSkillSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createSkill.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createSkill.reset()
    }
  }

  function onSubmit(data: CreateStaffSkillFormValues) {
    createSkill.mutate(
      { staffId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 rounded-full px-3.5">
          <Plus aria-hidden="true" />
          Add skill
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a skill
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            A credential or competence {staffName} brings to the job.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createSkill.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createSkill.error,
                "We couldn't add the skill. Try again."
              )}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="staff-skill-category">Category</FieldLabel>
              <Input
                id="staff-skill-category"
                autoComplete="off"
                placeholder="e.g. Certification"
                aria-invalid={!!errors.category}
                className={authInputClassName}
                {...register("category")}
              />
              <FieldError>{errors.category?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.skill}>
              <FieldLabel htmlFor="staff-skill-name">Skill</FieldLabel>
              <Input
                id="staff-skill-name"
                autoComplete="off"
                placeholder="e.g. Site supervision"
                aria-invalid={!!errors.skill}
                className={authInputClassName}
                {...register("skill")}
              />
              <FieldError>{errors.skill?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.description}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="staff-skill-description">
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id="staff-skill-description"
                autoComplete="off"
                placeholder="e.g. NCA registered, 5 years on site"
                aria-invalid={!!errors.description}
                className={authInputClassName}
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createSkill.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createSkill.isPending}
              className="h-10 rounded-full px-5"
            >
              {createSkill.isPending ? "Adding…" : "Add skill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
