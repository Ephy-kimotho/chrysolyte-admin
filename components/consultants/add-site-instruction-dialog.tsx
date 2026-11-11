"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { Plus } from "lucide-react"
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
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
import { Textarea } from "@/components/ui/textarea"
import { useCreateSiteInstruction } from "@/hooks/use-create-site-instruction"
import { useProjects } from "@/hooks/use-projects"
import { useStaff } from "@/hooks/use-staff"
import { createSiteInstructionSchema } from "@/lib/schemas/consultants"
import {
  consultantDisciplines,
  type CreateSiteInstructionFormValues,
} from "@/lib/types/consultants"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

// The date starts on today, the usual case; everything else must be filled in.
function getDefaultValues(
  projectId: string | undefined
): DefaultValues<CreateSiteInstructionFormValues> {
  return {
    projectId,
    date: format(new Date(), "yyyy-MM-dd"),
    issuer: "",
    instruction: "",
    deadline: "",
  }
}

type AddSiteInstructionDialogProps = {
  /** Records against this project and hides the project field. */
  projectId?: string
  triggerLabel?: string
  triggerClassName?: string
}

export function AddSiteInstructionDialog({
  projectId,
  triggerLabel = "Site instruction",
  triggerClassName = "h-11 rounded-xl px-4 font-semibold",
}: AddSiteInstructionDialogProps) {
  const [open, setOpen] = useState(false)
  const createSiteInstruction = useCreateSiteInstruction()
  const { data: projects } = useProjects()
  const { data: staff } = useStaff()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSiteInstructionFormValues>({
    resolver: zodResolver(createSiteInstructionSchema),
    defaultValues: getDefaultValues(projectId),
  })
  // The deadline picker can't go earlier than the issue date.
  const issuedOn = useWatch({ control, name: "date" })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createSiteInstruction.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues(projectId))
      createSiteInstruction.reset()
    }
  }

  function onSubmit(data: CreateSiteInstructionFormValues) {
    createSiteInstruction.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus aria-hidden="true" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Record a site instruction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            The instruction is tracked as open until it&apos;s carried out.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createSiteInstruction.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t record the instruction. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {!projectId && (
              <Field data-invalid={!!errors.projectId}>
                <FieldLabel htmlFor="instruction-project">Project</FieldLabel>
                <Controller
                  control={control}
                  name="projectId"
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      // "" shows the placeholder again after the form resets.
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="instruction-project"
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
                <FieldError>{errors.projectId?.message}</FieldError>
              </Field>
            )}

            <Field data-invalid={!!errors.discipline}>
              <FieldLabel htmlFor="instruction-discipline">
                Discipline
              </FieldLabel>
              <Controller
                control={control}
                name="discipline"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="instruction-discipline"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.discipline}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose the discipline" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {consultantDisciplines.map((discipline) => (
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

            <Field data-invalid={!!errors.issuer}>
              <FieldLabel htmlFor="instruction-issuer">Issuer</FieldLabel>
              <Input
                id="instruction-issuer"
                autoComplete="off"
                placeholder="e.g. Eng. Njoroge"
                aria-invalid={!!errors.issuer}
                className={authInputClassName}
                {...register("issuer")}
              />
              <FieldError>{errors.issuer?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.responsibleStaffId}
              // Without the project field it's alone on its row.
              className={projectId ? "sm:col-span-2" : undefined}
            >
              <FieldLabel htmlFor="instruction-responsible">
                Responsible
              </FieldLabel>
              <Controller
                control={control}
                name="responsibleStaffId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="instruction-responsible"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.responsibleStaffId}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a staff member" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.fullName} · {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.responsibleStaffId?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.instruction}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="instruction-text">Instruction</FieldLabel>
              <Textarea
                id="instruction-text"
                placeholder="e.g. Revise the window opening at Grid B3 to match the approved architectural detail."
                aria-invalid={!!errors.instruction}
                className="max-h-60 min-h-28 rounded-xl bg-background/60 px-3.5 py-2.5"
                {...register("instruction")}
              />
              <FieldError>{errors.instruction?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="instruction-date">Date issued</FieldLabel>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    id="instruction-date"
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

            <Field data-invalid={!!errors.deadline}>
              <FieldLabel htmlFor="instruction-deadline">Deadline</FieldLabel>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    id="instruction-deadline"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    minDate={issuedOn ? parseISO(issuedOn) : undefined}
                    placeholder="Choose the deadline"
                    aria-invalid={!!errors.deadline}
                  />
                )}
              />
              <FieldError>{errors.deadline?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createSiteInstruction.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createSiteInstruction.isPending}
              className="h-10 rounded-full px-5"
            >
              {createSiteInstruction.isPending
                ? "Recording…"
                : "Record instruction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
