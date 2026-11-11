import { AddWelfareItemDialog } from "@/components/stores/add-welfare-item-dialog"
import { StockNoticeBadge } from "@/components/stores/stock-notice-badge"
import { StoreCard, storeCellClassName } from "@/components/stores/store-card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import type { WelfareStore } from "@/lib/types/stores"

type WelfareStoreCardProps = {
  store: WelfareStore
}

export function WelfareStoreCard({ store }: WelfareStoreCardProps) {
  return (
    <StoreCard
      titleId={`welfare-store-${store.id}`}
      title={store.name}
      action={
        <AddWelfareItemDialog storeId={store.id} storeName={store.name} />
      }
      className="h-full"
    >
      {store.items.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          No items in this store yet.
        </p>
      ) : (
        <Table>
          <TableBody className="[&_tr:last-child]:border-b">
            {store.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={storeCellClassName}>
                  {item.name}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {formatNumber(item.quantity)} {item.unit}
                </TableCell>
                <TableCell className={storeCellClassName}>
                  <StockNoticeBadge
                    quantity={item.quantity}
                    minimum={item.minimum}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </StoreCard>
  )
}
