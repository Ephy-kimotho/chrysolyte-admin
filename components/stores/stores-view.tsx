"use client"

import { EquipmentStoreCard } from "@/components/stores/equipment-store-card"
import { MaterialStoreCard } from "@/components/stores/material-store-card"
import { WelfareStoreCard } from "@/components/stores/welfare-store-card"
import { useStores } from "@/hooks/use-stores"

export function StoresView() {
  const { data: stores } = useStores()

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold text-heading">
        Stores management
      </h2>

      {stores.materialStores.map((store) => (
        <MaterialStoreCard key={store.projectId} store={store} />
      ))}

      <section
        aria-labelledby="welfare-stores-heading"
        className="flex flex-col gap-4 pt-2"
      >
        <h2
          id="welfare-stores-heading"
          className="font-heading text-base font-bold"
        >
          Welfare stores
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stores.welfareStores.map((store) => (
            <li key={store.id} className="min-w-0">
              <WelfareStoreCard store={store} />
            </li>
          ))}
        </ul>
      </section>

      <EquipmentStoreCard equipment={stores.equipment} />
    </div>
  )
}
