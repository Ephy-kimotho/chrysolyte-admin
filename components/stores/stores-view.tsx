import { EquipmentStoreCard } from "@/components/stores/equipment-store-card"
import { WelfareStoreCard } from "@/components/stores/welfare-store-card"

export function StoresView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-bold text-heading">
          Stores management
        </h2>
        <p className="text-sm text-muted-foreground">
          Company-wide welfare and equipment stores. Each project&apos;s
          materials are kept in its own store, on the project&apos;s page.
        </p>
      </div>

      <WelfareStoreCard />

      <EquipmentStoreCard />
    </div>
  )
}
