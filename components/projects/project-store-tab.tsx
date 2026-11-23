"use client"

import { LoadError } from "@/components/load-error"
import { AddStockItemDialog } from "@/components/stores/add-stock-item-dialog"
import { StockItemActions } from "@/components/stores/stock-item-actions"
import { StockNoticeBadge } from "@/components/stores/stock-notice-badge"
import {
  StoreCard,
  storeCellClassName,
  storeHeadClassName,
} from "@/components/stores/store-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProjectStoreItems } from "@/hooks/use-project-store-items"
import { formatNumber, formatShortDateTime } from "@/lib/format"
import type { Project } from "@/lib/types/projects"

const columnCount = 7
const skeletonRows = [0, 1, 2]

type ProjectStoreTabProps = {
  project: Pick<Project, "id" | "name">
}

/** The project's site store: what's on hand and what needs restocking. */
export function ProjectStoreTab({ project }: ProjectStoreTabProps) {
  const storeItems = useProjectStoreItems(project.id)
  const title = `${project.name} site store`

  return (
    <StoreCard
      titleId={`project-store-${project.id}`}
      title={title}
      action={<AddStockItemDialog projectId={project.id} storeName={title} />}
    >
      {storeItems.isError ? (
        <LoadError
          error={storeItems.error}
          fallback="We couldn't load the store items."
          onRetry={() => storeItems.refetch()}
          isRetrying={storeItems.isFetching}
        />
      ) : (
        <Table className="min-w-[48rem]" aria-busy={storeItems.isPending}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={storeHeadClassName}>Item</TableHead>
              <TableHead className={storeHeadClassName}>Quantity</TableHead>
              <TableHead className={storeHeadClassName}>Minimum</TableHead>
              <TableHead className={storeHeadClassName}>Supplier</TableHead>
              <TableHead className={storeHeadClassName}>Updated</TableHead>
              <TableHead className={storeHeadClassName}>Notice</TableHead>
              <TableHead className={storeHeadClassName}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {storeItems.isPending ? (
              skeletonRows.map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={storeCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : storeItems.data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  Nothing in this store yet.
                </TableCell>
              </TableRow>
            ) : (
              storeItems.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={`${storeCellClassName} font-medium`}>
                    {item.item}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} tabular-nums`}>
                    {formatNumber(item.quantity)} {item.unit}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} tabular-nums`}>
                    {formatNumber(item.minimum)} {item.unit}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    {item.supplier}
                  </TableCell>
                  <TableCell
                    className={`${storeCellClassName} whitespace-nowrap tabular-nums`}
                  >
                    {formatShortDateTime(item.updatedAt)}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    <StockNoticeBadge isLow={item.isLow} />
                  </TableCell>
                  <TableCell className={`${storeCellClassName} w-0 py-1.5`}>
                    <div className="flex justify-end">
                      <StockItemActions storeItem={item} />
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
