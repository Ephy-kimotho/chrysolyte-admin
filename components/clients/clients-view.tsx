"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { AddClientDialog } from "@/components/clients/add-clients-dialog"
import { ClientActions } from "@/components/clients/client-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useClients } from "@/hooks/use-clients"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import {
  formatDate,
  formatNumber,
  formatPhoneNumber,
  pluralize,
} from "@/lib/format"
import type { Client } from "@/lib/types/clients"

const headClassName =
  "h-10 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
const cellClassName = "px-3 py-3.5 align-middle whitespace-normal"

export function ClientsView() {
  const [search, setSearch] = useState("")
  const searchTerm = useDebouncedValue(search.trim())
  const clients = useClients({ search: searchTerm })

  return (
    <section aria-labelledby="clients-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="clients-heading"
            className="font-heading text-xl font-bold text-heading"
          >
            Clients
          </h2>
          <p className="text-sm text-muted-foreground">
            The companies and people Chrysolyte works for.
          </p>
        </div>
        <AddClientDialog />
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search clients"
          aria-label="Search clients"
          className="h-11 rounded-xl bg-background/60 pr-3.5 pl-10 md:text-sm"
        />
      </div>

      {clients.isPending ? (
        <ClientsSkeleton />
      ) : clients.isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(clients.error, "We couldn't load the clients.")}
          </p>
          <Button
            variant="outline"
            onClick={() => clients.refetch()}
            disabled={clients.isFetching}
            className="h-10 rounded-full px-5"
          >
            {clients.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : (
        <ClientsList
          clients={clients.data}
          searchTerm={searchTerm}
          // While a new search loads, the last results stay up, dimmed.
          isUpdating={clients.isPlaceholderData}
        />
      )}
    </section>
  )
}

function ClientsList({
  clients,
  searchTerm,
  isUpdating,
}: {
  clients: Client[]
  searchTerm: string
  isUpdating: boolean
}) {
  return (
    <div
      aria-busy={isUpdating}
      className="flex flex-col gap-3 transition-opacity aria-busy:opacity-60"
    >
      <p role="status" className="sr-only">
        {isUpdating
          ? "Searching…"
          : `${clients.length} ${pluralize(clients.length, "client", "clients")}`}
      </p>

      {clients.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          {searchTerm
            ? `No clients match “${searchTerm}”.`
            : "No clients yet. Add one to start linking them to projects."}
        </p>
      ) : (
        <>
          {/* Wide screens: a table. */}
          <Card className="hidden rounded-2xl px-2 py-1 lg:flex">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={headClassName}>Client</TableHead>
                  <TableHead className={headClassName}>
                    Contact person
                  </TableHead>
                  <TableHead className={headClassName}>Phone</TableHead>
                  <TableHead className={headClassName}>Projects</TableHead>
                  <TableHead className={headClassName}>Status</TableHead>
                  <TableHead className={headClassName}>Added</TableHead>
                  <TableHead className={headClassName}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell
                      className={`${cellClassName} min-w-48 font-semibold`}
                    >
                      {client.name}
                    </TableCell>
                    <TableCell className={`${cellClassName} min-w-52`}>
                      <p>{client.contactName}</p>
                      <p className="text-xs break-all text-muted-foreground">
                        {client.email}
                      </p>
                    </TableCell>
                    <TableCell
                      className={`${cellClassName} whitespace-nowrap tabular-nums`}
                    >
                      <ClientPhone phone={client.phone} />
                    </TableCell>
                    <TableCell className={`${cellClassName} tabular-nums`}>
                      {formatNumber(client.projectCount)}
                    </TableCell>
                    <TableCell className={cellClassName}>
                      <ClientStatusBadge active={client.active} />
                    </TableCell>
                    <TableCell
                      className={`${cellClassName} whitespace-nowrap tabular-nums`}
                    >
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell className={`${cellClassName} w-0 py-2.5`}>
                      <div className="flex justify-end">
                        <ClientActions client={client} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Smaller screens: one card per client. */}
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
            {clients.map((client) => (
              <li key={client.id}>
                <Card className="h-full gap-4 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col items-start gap-1.5">
                      <p className="font-semibold wrap-break-word">
                        {client.name}
                      </p>
                      <ClientStatusBadge active={client.active} />
                    </div>
                    <div className="-mt-1 -mr-1 shrink-0">
                      <ClientActions client={client} />
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="col-span-2 flex min-w-0 flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">
                        Contact person
                      </dt>
                      <dd>
                        <p>{client.contactName}</p>
                        <p className="break-all text-muted-foreground">
                          {client.email}
                        </p>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">Phone</dt>
                      <dd className="tabular-nums">
                        <ClientPhone phone={client.phone} />
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">
                        Projects
                      </dt>
                      <dd className="tabular-nums">
                        {formatNumber(client.projectCount)}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">Added</dt>
                      <dd className="tabular-nums">
                        {formatDate(client.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function ClientPhone({ phone }: { phone: string | null }) {
  if (!phone) return <span className="text-muted-foreground">Not given</span>
  return formatPhoneNumber(phone)
}

function ClientStatusBadge({ active }: { active: boolean }) {
  if (!active) return <Badge variant="warning">Inactive</Badge>
  return <Badge className="bg-primary/15 text-primary">Active</Badge>
}

const skeletonRows = [0, 1, 2, 3]

function ClientsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <p role="status" className="sr-only">
        Loading clients…
      </p>

      <Card className="hidden gap-0 rounded-2xl px-5 py-2 lg:flex">
        {skeletonRows.map((row) => (
          <div
            key={row}
            className="flex items-center gap-6 border-b py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-40" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {skeletonRows.map((row) => (
          <Card key={row} className="gap-4 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
