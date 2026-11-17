"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@/components/ui/dialog"
import { useUpdateClient } from "@/hooks/use-update-client"
import { getErrorMessage } from "@/lib/api/errors"
import { updateClientSchema } from "@/lib/schemas/clients"
import type {
  Client,
  UpdateClientFormInput,
  UpdateClientFormValues,
} from "@/lib/types/clients"

type UpdateClientDialogProps = {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateClientDialog({
  client,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateClientDialogProps) {
  const updateClient = useUpdateClient()

  function handleOpenChange(nextOpen: boolean) {
    if (updateClient.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateClient.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update client
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {client.name}.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the client's current details. */}
        <UpdateClientForm
          client={client}
          updateClient={updateClient}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function UpdateClientForm({
  client,
  updateClient,
  onUpdated,
}: {
  client: Client
  updateClient: ReturnType<typeof useUpdateClient>
  onUpdated: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientFormInput, unknown, UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: client.name,
      contactName: client.contactName,
      email: client.email,
      phone: client.phone ?? "",
    },
  })

  function onSubmit(data: UpdateClientFormValues) {
    updateClient.mutate({ id: client.id, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateClient.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateClient.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <ClientFormFields
        register={register}
        errors={errors}
        idPrefix={`update-client-${client.id}`}
        phoneOptional
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateClient.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateClient.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateClient.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
