"use client"

import { useMemo, useState } from "react"

import { LoadError } from "@/components/load-error"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import { AddEquipmentDialog } from "@/components/stores/add-equipment-dialog"
import { EquipmentActions } from "@/components/stores/equipment-actions"
import {
  StoreCard,
  storeCellClassName,
  storeHeadClassName,
} from "@/components/stores/store-card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEquipment } from "@/hooks/use-equipment"
import { useProjects } from "@/hooks/use-projects"
import { useStaffNames } from "@/hooks/use-staff-names"
import { formatDate, formatNumber } from "@/lib/format"
import {
  equipmentConditions,
  type EquipmentCondition,
} from "@/lib/types/stores"
import { cn } from "@/lib/utils"

const columnCount = 8
const skeletonRows = [0, 1, 2]
// Radix Select items can't use "", so "all" stands for no filter.
const allConditions = "all"

const conditionBadgeVariants: Record<
  EquipmentCondition,
  "success" | "warning" | "destructive"
> = {
  Good: "success",
  Fair: "warning",
  "Needs repair": "destructive",
}

/** Equipment and tools, optionally narrowed by condition or project. */
export function EquipmentStoreCard() {
  const [condition, setCondition] = useState<EquipmentCondition>()
  const [assignedTo, setAssignedTo] = useState<string>()
  const equipmentQuery = useEquipment({ condition, assignedTo })
  const equipment = equipmentQuery.data ?? []
  const isFiltered = Boolean(condition || assignedTo)

  // The API only sends ids, so look the names up.
  const staffNames = useStaffNames()
  const { data: projects } = useProjects()
  const projectNames = useMemo(
    () => new Map(projects?.map((project) => [project.id, project.name])),
    [projects]
  )

  return (
    <StoreCard
      titleId="equipment-store-heading"
      title="Equipment & tools store"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <label htmlFor="equipment-condition-filter" className="sr-only">
            Filter by condition
          </label>
          <Select
            value={condition ?? allConditions}
            onValueChange={(value) =>
              setCondition(
                value === allConditions
                  ? undefined
                  : (value as EquipmentCondition)
              )
            }
          >
            <SelectTrigger
              id="equipment-condition-filter"
              className="h-8! min-w-40 flex-1 rounded-xl bg-background/60 px-3 text-sm sm:flex-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value={allConditions}>All conditions</SelectItem>
              {equipmentConditions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="min-w-48 flex-1 sm:w-56 sm:flex-none">
            <label htmlFor="equipment-project-filter" className="sr-only">
              Filter by assigned project
            </label>
            <ProjectCombobox
              id="equipment-project-filter"
              value={assignedTo ?? ""}
              onChange={(option) => setAssignedTo(option?.value || undefined)}
              placeholder="All projects"
              clearable
              className="h-8 rounded-xl px-3 text-sm"
            />
          </div>

          <AddEquipmentDialog />
        </div>
      }
    >
      {equipmentQuery.isError ? (
        <LoadError
          error={equipmentQuery.error}
          fallback="We couldn't load the equipment."
          onRetry={() => equipmentQuery.refetch()}
          isRetrying={equipmentQuery.isFetching}
        />
      ) : (
        <Table
          // Dimmed while a new filter loads over the previous results.
          aria-busy={
            equipmentQuery.isPending || equipmentQuery.isPlaceholderData
          }
          className={cn(
            "min-w-[56rem] transition-opacity",
            equipmentQuery.isPlaceholderData && "opacity-60"
          )}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={storeHeadClassName}>Asset no.</TableHead>
              <TableHead className={storeHeadClassName}>Item</TableHead>
              <TableHead className={storeHeadClassName}>Quantity</TableHead>
              <TableHead className={storeHeadClassName}>Condition</TableHead>
              <TableHead className={storeHeadClassName}>Assigned to</TableHead>
              <TableHead className={storeHeadClassName}>Responsible</TableHead>
              <TableHead className={storeHeadClassName}>Issued</TableHead>
              <TableHead className={storeHeadClassName}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {equipmentQuery.isPending ? (
              skeletonRows.map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={storeCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : equipment.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  {isFiltered
                    ? "No equipment matches these filters."
                    : "No equipment or tools yet."}
                </TableCell>
              </TableRow>
            ) : (
              equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    className={`${storeCellClassName} whitespace-nowrap tabular-nums`}
                  >
                    {item.assetNumber ?? "—"}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    <p className="font-medium">{item.item}</p>
                    {item.category && (
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} tabular-nums`}>
                    {formatNumber(item.quantity)}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    <ConditionBadge condition={item.condition} />
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    {item.assignedProjectId ? (
                      (projectNames.get(item.assignedProjectId) ??
                      item.assignedProjectId)
                    ) : (
                      <span className="text-muted-foreground">
                        General store
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    {(item.responsibleId &&
                      staffNames.get(item.responsibleId)) ??
                      "—"}
                  </TableCell>
                  <TableCell
                    className={`${storeCellClassName} whitespace-nowrap tabular-nums`}
                  >
                    {item.issuedDate ? formatDate(item.issuedDate) : "—"}
                    {item.returnDate && (
                      <p className="text-xs text-muted-foreground">
                        Return by {formatDate(item.returnDate)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} w-0 py-1.5`}>
                    <div className="flex justify-end">
                      <EquipmentActions equipment={item} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </StoreCard>
  )
}

function ConditionBadge({ condition }: { condition: string | null }) {
  if (!condition) return <span className="text-muted-foreground">—</span>
  const variant =
    conditionBadgeVariants[condition as EquipmentCondition] ?? "secondary"
  return (
    <Badge variant={variant} className="h-6 px-2.5 text-xs font-semibold">
      {condition}
    </Badge>
  )
}
