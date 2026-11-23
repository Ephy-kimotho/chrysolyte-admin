"use client"

import { useState } from "react"

import { LoadError } from "@/components/load-error"
import { AddWelfareItemDialog } from "@/components/stores/add-welfare-item-dialog"
import { StockNoticeBadge } from "@/components/stores/stock-notice-badge"
import {
  StoreCard,
  storeCellClassName,
  storeHeadClassName,
} from "@/components/stores/store-card"
import { WelfareItemActions } from "@/components/stores/welfare-item-actions"
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
import { useWelfareItems } from "@/hooks/use-welfare-items"
import { formatNumber, formatShortDateTime } from "@/lib/format"
import { welfareCategories, type WelfareCategory } from "@/lib/types/stores"
import { cn } from "@/lib/utils"

const columnCount = 7
const skeletonRows = [0, 1, 2]
// Radix Select items can't use "", so "all" stands for no filter.
const allCategories = "all"

/** Food, beddings and toiletries, optionally narrowed to one category. */
export function WelfareStoreCard() {
  const [category, setCategory] = useState<WelfareCategory>()
  const welfareItems = useWelfareItems({ category })
  const items = welfareItems.data ?? []

  return (
    <StoreCard
      titleId="welfare-stores-heading"
      title="Welfare stores"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <label htmlFor="welfare-category-filter" className="sr-only">
            Filter by category
          </label>
          <Select
            value={category ?? allCategories}
            onValueChange={(value) =>
              setCategory(
                value === allCategories ? undefined : (value as WelfareCategory)
              )
            }
          >
            <SelectTrigger
              id="welfare-category-filter"
              className="h-8! min-w-40 flex-1 rounded-xl bg-background/60 px-3 text-sm sm:flex-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value={allCategories}>All categories</SelectItem>
              {welfareCategories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddWelfareItemDialog defaultCategory={category} />
        </div>
      }
    >
      {welfareItems.isError ? (
        <LoadError
          error={welfareItems.error}
          fallback="We couldn't load the welfare stores."
          onRetry={() => welfareItems.refetch()}
          isRetrying={welfareItems.isFetching}
        />
      ) : (
        <Table
          // Dimmed while a new filter loads over the previous results.
          aria-busy={welfareItems.isPending || welfareItems.isPlaceholderData}
          className={cn(
            "min-w-[44rem] transition-opacity",
            welfareItems.isPlaceholderData && "opacity-60"
          )}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={storeHeadClassName}>Item</TableHead>
              <TableHead className={storeHeadClassName}>Category</TableHead>
              <TableHead className={storeHeadClassName}>Quantity</TableHead>
              <TableHead className={storeHeadClassName}>Minimum</TableHead>
              <TableHead className={storeHeadClassName}>Updated</TableHead>
              <TableHead className={storeHeadClassName}>Notice</TableHead>
              <TableHead className={storeHeadClassName}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {welfareItems.isPending ? (
              skeletonRows.map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={storeCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  {category
                    ? `No ${category.toLowerCase()} items yet.`
                    : "No welfare items yet."}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={`${storeCellClassName} font-medium`}>
                    {item.item}
                  </TableCell>
                  <TableCell className={storeCellClassName}>
                    {item.category}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} tabular-nums`}>
                    {formatNumber(item.quantity)} {item.unit}
                  </TableCell>
                  <TableCell className={`${storeCellClassName} tabular-nums`}>
                    {formatNumber(item.minimum)} {item.unit}
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
                      <WelfareItemActions welfareItem={item} />
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
