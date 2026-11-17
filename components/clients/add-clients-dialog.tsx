"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { ClientFormFields } from "@/components/clients/client-form-fields"
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
import { useCreateClient } from "@/hooks/use-create-client"
import { getErrorMessage } from "@/lib/api/errors"
import { createClientSchema } from "@/lib/schemas/clients"
import type { CreateClientFormValues } from "@/lib/types/clients"

const defaultValues: CreateClientFormValues = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
}

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const createClient = useCreateClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues,
  })

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createClient.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createClient.reset()
    }
  }

  function onSubmit(data: CreateClientFormValues) {
    createClient.mutate({ data }, { onSuccess: () => handleOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Add client
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a client
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            New clients are active as soon as they&apos;re added.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createClient.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createClient.error,
                "We couldn't add the client. Try again."
              )}
            </p>
          )}

          <ClientFormFields
            register={register}
            errors={errors}
            idPrefix="add-client"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createClient.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createClient.isPending}
              className="h-10 rounded-full px-5"
            >
              {createClient.isPending ? "Adding…" : "Add client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
