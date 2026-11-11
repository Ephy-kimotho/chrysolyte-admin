import { getProjectsSnapshot } from "@/lib/mock/projects"
import type {
  CreateEquipmentFormValues,
  CreateStockItemFormValues,
  CreateWelfareItemFormValues,
  Equipment,
  StockItem,
  Stores,
  WelfareItem,
  WelfareStore,
} from "@/lib/types/stores"

// In-memory stand-in for a stores API. Changes last until the page reloads.

/** Site material stores, keyed by project id. */
let materialStores: Record<string, StockItem[]> = {
  "kilimani-residence": [
    {
      id: "kilimani-cement",
      material: "Cement",
      unit: "bags",
      available: 56,
      minimum: 60,
      forecastNeed: 80,
    },
    {
      id: "kilimani-d12",
      material: "D12 reinforcement steel",
      unit: "lengths",
      available: 110,
      minimum: 40,
      forecastNeed: 65,
    },
    {
      id: "kilimani-d16",
      material: "D16 steel",
      unit: "metres",
      available: 110,
      minimum: 2,
      forecastNeed: 34,
    },
  ],
}

let welfareStores: WelfareStore[] = [
  {
    id: "food",
    name: "Food store",
    items: [
      {
        id: "maize-flour",
        name: "Maize flour",
        unit: "kg",
        quantity: 45,
        minimum: 20,
      },
      { id: "milk", name: "Milk", unit: "litres", quantity: 12, minimum: 5 },
    ],
  },
  {
    id: "beddings",
    name: "Beddings store",
    items: [
      {
        id: "blankets",
        name: "Blankets",
        unit: "pcs",
        quantity: 18,
        minimum: 10,
      },
      {
        id: "pillows",
        name: "Pillows",
        unit: "pcs",
        quantity: 22,
        minimum: 10,
      },
    ],
  },
  {
    id: "toiletries",
    name: "Toiletries store",
    items: [
      {
        id: "bathing-soap",
        name: "Bathing soap",
        unit: "bars",
        quantity: 36,
        minimum: 12,
      },
      { id: "omo", name: "Omo", unit: "packets", quantity: 33, minimum: 10 },
    ],
  },
]

type StoredEquipment = Omit<Equipment, "assignedProjectCode">

let equipment: StoredEquipment[] = [
  {
    id: "concrete-mixer",
    item: "Concrete mixer",
    category: "Plant",
    quantity: 1,
    condition: "Good",
    assignedProjectId: "kilimani-residence",
  },
  {
    id: "rotary-hammer",
    item: "Rotary hammer",
    category: "Power tool",
    quantity: 3,
    condition: "Good",
    assignedProjectId: null,
  },
]

export function getStoresSnapshot(): Stores {
  const projects = getProjectsSnapshot()

  return {
    // Only projects that still exist and have a material store.
    materialStores: projects
      .filter((project) => materialStores[project.id])
      .map((project) => ({
        projectId: project.id,
        projectName: project.name,
        items: materialStores[project.id],
      })),
    welfareStores,
    equipment: equipment.map((item) => ({
      ...item,
      assignedProjectCode:
        projects.find((project) => project.id === item.assignedProjectId)
          ?.code ?? null,
    })),
  }
}

export async function getStores() {
  return getStoresSnapshot()
}

export async function createStockItem(
  projectId: string,
  data: CreateStockItemFormValues
) {
  const item: StockItem = { id: crypto.randomUUID(), ...data }
  materialStores = {
    ...materialStores,
    [projectId]: [...(materialStores[projectId] ?? []), item],
  }
  return item
}

export async function createWelfareItem(
  storeId: string,
  data: CreateWelfareItemFormValues
) {
  const item: WelfareItem = { id: crypto.randomUUID(), ...data }
  welfareStores = welfareStores.map((store) =>
    store.id === storeId ? { ...store, items: [...store.items, item] } : store
  )
  return item
}

export async function createEquipment(data: CreateEquipmentFormValues) {
  const item: StoredEquipment = { id: crypto.randomUUID(), ...data }
  equipment = [...equipment, item]
  return item
}
