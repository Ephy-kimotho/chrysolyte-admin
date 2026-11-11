import { AddStockItemDialog } from "@/components/stores/add-stock-item-dialog"
import { StockNoticeBadge } from "@/components/stores/stock-notice-badge"
import {
  StoreCard,
  storeCellClassName,
  storeHeadClassName,
} from "@/components/stores/store-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import type { MaterialStore } from "@/lib/types/stores"

type MaterialStoreCardProps = {
  store: MaterialStore
}

export function MaterialStoreCard({ store }: MaterialStoreCardProps) {
  const title = `${store.projectName} material store`

  return (
    <StoreCard
      titleId={`material-store-${store.projectId}`}
      title={title}
      action={
        <AddStockItemDialog projectId={store.projectId} storeName={title} />
      }
    >
      <Table className="min-w-[40rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={storeHeadClassName}>Material</TableHead>
            <TableHead className={storeHeadClassName}>Available</TableHead>
            <TableHead className={storeHeadClassName}>Minimum</TableHead>
            <TableHead className={storeHeadClassName}>Forecast need</TableHead>
            <TableHead className={storeHeadClassName}>Notice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {store.items.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No materials in this store yet.
              </TableCell>
            </TableRow>
          ) : (
            store.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={storeCellClassName}>
                  {item.material}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {formatNumber(item.available)} {item.unit}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {formatNumber(item.minimum)}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {formatNumber(item.forecastNeed)}
                </TableCell>
                <TableCell className={storeCellClassName}>
                  <StockNoticeBadge
                    quantity={item.available}
                    minimum={item.minimum}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StoreCard>
  )
}
