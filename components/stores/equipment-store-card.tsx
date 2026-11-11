import { AddEquipmentDialog } from "@/components/stores/add-equipment-dialog"
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
import type { Equipment } from "@/lib/types/stores"

type EquipmentStoreCardProps = {
  equipment: Equipment[]
}

export function EquipmentStoreCard({ equipment }: EquipmentStoreCardProps) {
  return (
    <StoreCard
      titleId="equipment-store-heading"
      title="Equipment & tools store"
      action={<AddEquipmentDialog />}
    >
      <Table className="min-w-[40rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={storeHeadClassName}>Item</TableHead>
            <TableHead className={storeHeadClassName}>Category</TableHead>
            <TableHead className={storeHeadClassName}>Quantity</TableHead>
            <TableHead className={storeHeadClassName}>Condition</TableHead>
            <TableHead className={storeHeadClassName}>Assigned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {equipment.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No equipment or tools yet.
              </TableCell>
            </TableRow>
          ) : (
            equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={storeCellClassName}>
                  {item.item}
                </TableCell>
                <TableCell className={storeCellClassName}>
                  {item.category}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {formatNumber(item.quantity)}
                </TableCell>
                <TableCell className={storeCellClassName}>
                  {item.condition}
                </TableCell>
                <TableCell className={`${storeCellClassName} tabular-nums`}>
                  {item.assignedProjectCode ?? "General store"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StoreCard>
  )
}
