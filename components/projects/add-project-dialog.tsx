"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseISO } from "date-fns"
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
import { useCreateProject } from "@/hooks/use-create-project"
import { createProjectSchema } from "@/lib/schemas/projects"
import {
  contractTypes,
  projectPhases,
  type CreateProjectFormValues,
} from "@/lib/types/projects"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

// Division and contract type aren't preselected, so the user has to choose.
const defaultValues: DefaultValues<CreateProjectFormValues> = {
  name: "",
  client: "",
  location: "",
  startDate: "",
  dueDate: "",
  supervisor: "",
  projectManager: "",
  leadConsultant: "",
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}{" "}
      <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  )
}

export function AddProjectDialog() {
  const [open, setOpen] = useState(false)
  const createProject = useCreateProject()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  })
  // The deadline picker can't go earlier than the start date.
  const startDate = useWatch({ control, name: "startDate" })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createProject.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createProject.reset()
    }
  }

  function onSubmit(data: CreateProjectFormValues) {
    createProject.mutate({ data }, { onSuccess: () => handleOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Add project
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a project
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            The project gets a reference code when you add it. Its progress
            starts at 0% and updates automatically as work is logged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createProject.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the project. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>
              <Input
                id="project-name"
                autoComplete="off"
                placeholder="e.g. Kilimani Residence"
                aria-invalid={!!errors.name}
                className={authInputClassName}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.client}>
              <FieldLabel htmlFor="project-client">Client</FieldLabel>
              <Input
                id="project-client"
                autoComplete="off"
                placeholder="e.g. Jane Wanjiku or Acme Holdings Ltd"
                aria-invalid={!!errors.client}
                className={authInputClassName}
                {...register("client")}
              />
              <FieldError>{errors.client?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.phase}>
              <FieldLabel htmlFor="project-division">Division</FieldLabel>
              <Controller
                control={control}
                name="phase"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="project-division"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.phase}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a division" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {projectPhases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.phase?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.contractType}>
              <FieldLabel htmlFor="project-contract-type">
                Contract type
              </FieldLabel>
              <Controller
                control={control}
                name="contractType"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="project-contract-type"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.contractType}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a contract type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {contractTypes.map((contractType) => (
                        <SelectItem key={contractType} value={contractType}>
                          {contractType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.contractType?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="project-location">Location</FieldLabel>
              <Input
                id="project-location"
                autoComplete="off"
                placeholder="e.g. Kilimani, Nairobi"
                aria-invalid={!!errors.location}
                className={authInputClassName}
                {...register("location")}
              />
              <FieldError>{errors.location?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.budget}>
              <FieldLabel htmlFor="project-budget">Budget (KES)</FieldLabel>
              <Input
                id="project-budget"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="e.g. 12500000"
                aria-invalid={!!errors.budget}
                className={authInputClassName}
                {...register("budget", { valueAsNumber: true })}
              />
              <FieldError>{errors.budget?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.startDate}>
              <FieldLabel htmlFor="project-start-date">Start date</FieldLabel>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    id="project-start-date"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Choose the start date"
                    aria-invalid={!!errors.startDate}
                  />
                )}
              />
              <FieldError>{errors.startDate?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.dueDate}>
              <FieldLabel htmlFor="project-deadline">Deadline</FieldLabel>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <DatePicker
                    id="project-deadline"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    minDate={startDate ? parseISO(startDate) : undefined}
                    placeholder="Choose the deadline"
                    aria-invalid={!!errors.dueDate}
                  />
                )}
              />
              <FieldError>{errors.dueDate?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.supervisor}>
              <FieldLabel htmlFor="project-supervisor">
                <OptionalLabel>Supervisor</OptionalLabel>
              </FieldLabel>
              <Input
                id="project-supervisor"
                autoComplete="off"
                placeholder="e.g. Peter Mwangi"
                aria-invalid={!!errors.supervisor}
                className={authInputClassName}
                {...register("supervisor")}
              />
              <FieldError>{errors.supervisor?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.projectManager}>
              <FieldLabel htmlFor="project-manager">
                <OptionalLabel>Project manager</OptionalLabel>
              </FieldLabel>
              <Input
                id="project-manager"
                autoComplete="off"
                placeholder="e.g. James Kamau"
                aria-invalid={!!errors.projectManager}
                className={authInputClassName}
                {...register("projectManager")}
              />
              <FieldError>{errors.projectManager?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.leadConsultant}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="project-lead-consultant">
                <OptionalLabel>Lead consultant</OptionalLabel>
              </FieldLabel>
              <Input
                id="project-lead-consultant"
                autoComplete="off"
                placeholder="e.g. Eng. Njoroge"
                aria-invalid={!!errors.leadConsultant}
                className={authInputClassName}
                {...register("leadConsultant")}
              />
              <FieldError>{errors.leadConsultant?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createProject.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="h-10 rounded-full px-5"
            >
              {createProject.isPending ? "Adding…" : "Add project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
