import { isValid, parseISO } from "date-fns"

import { axiosInstance } from "@/lib/axios"
import {
  equipmentCategories,
  equipmentConditions,
  type CreateEquipmentFormValues,
  type CreateEquipmentPayload,
  type CreateStockItemFormValues,
  type CreateStockItemPayload,
  type CreateWelfareItemFormValues,
  type CreateWelfareItemPayload,
  type Equipment,
  type EquipmentFilters,
  type EquipmentResponse,
  type ProjectStoreItem,
  type UpdateEquipmentPayload,
  type ProjectStoreItemResponse,
  type WelfareItem,
  type WelfareItemFilters,
  type WelfareItemResponse,
} from "@/lib/types/stores"

function projectStorePath(projectId: string) {
  return `/projects/projects/${encodeURIComponent(projectId)}/store`
}

/** `2026-11-23T18:27:32.313567+03:00` → `2026-11-23T15:27:32.313Z`. */
function toIsoDateTime(timestamp: string) {
  const date = parseISO(timestamp)
  return isValid(date) ? date.toISOString() : timestamp
}

function toProjectStoreItem(item: ProjectStoreItemResponse): ProjectStoreItem {
  return {
    id: item.store_id,
    projectId: item.project_id,
    item: item.item,
    quantity: item.qty,
    minimum: item.min_qty,
    unit: item.unit,
    supplier: item.supplier,
    updatedAt: toIsoDateTime(item.updated_at),
    isLow: item.low,
  }
}

/** The items in a project's site store, low stock first, then by name. */
export async function listProjectStoreItems(projectId: string) {
  const response = await axiosInstance.get<ProjectStoreItemResponse[]>(
    projectStorePath(projectId)
  )
  return response.data
    .map(toProjectStoreItem)
    .sort(
      (a, b) =>
        Number(b.isLow) - Number(a.isLow) || a.item.localeCompare(b.item)
    )
}

function storeItemPath(storeItemId: string) {
  return `/projects/store/${encodeURIComponent(storeItemId)}`
}

function toStockItemPayload(
  values: CreateStockItemFormValues
): CreateStockItemPayload {
  return {
    item: values.item,
    qty: values.qty,
    min_qty: values.minQty,
    unit: values.unit,
    supplier: values.supplier,
  }
}

/** Adds an item to a project's site store. */
export async function createStockItem(
  projectId: string,
  values: CreateStockItemFormValues
) {
  const response = await axiosInstance.post(
    projectStorePath(projectId),
    toStockItemPayload(values)
  )
  return response.data
}

/** Saves changes to a store item. */
export async function updateStockItem(
  storeItemId: string,
  values: CreateStockItemFormValues
) {
  const response = await axiosInstance.patch(
    storeItemPath(storeItemId),
    toStockItemPayload(values)
  )
  return response.data
}

/** Removes an item from its project's store. */
export async function deleteStockItem(storeItemId: string) {
  await axiosInstance.delete(storeItemPath(storeItemId))
}

const welfareStoresPath = "/projects/welfare-stores"

function toWelfareItem(item: WelfareItemResponse): WelfareItem {
  return {
    id: item.welfare_store_id,
    category: item.category,
    item: item.item,
    quantity: item.qty,
    minimum: item.min_qty,
    unit: item.unit,
    updatedAt: toIsoDateTime(item.updated_at),
    isLow: item.low,
  }
}

/** Welfare store items, low stock first, then by category and name. */
export async function listWelfareItems(filters: WelfareItemFilters = {}) {
  const response = await axiosInstance.get<WelfareItemResponse[]>(
    welfareStoresPath,
    { params: { category: filters.category } }
  )
  return response.data
    .map(toWelfareItem)
    .sort(
      (a, b) =>
        Number(b.isLow) - Number(a.isLow) ||
        a.category.localeCompare(b.category) ||
        a.item.localeCompare(b.item)
    )
}

function welfareItemPath(welfareItemId: string) {
  return `${welfareStoresPath}/${encodeURIComponent(welfareItemId)}`
}

function toWelfareItemPayload(
  values: CreateWelfareItemFormValues
): CreateWelfareItemPayload {
  return {
    category: values.category,
    item: values.item,
    qty: values.qty,
    min_qty: values.minQty,
    unit: values.unit,
  }
}

/** Adds an item to a welfare store. */
export async function createWelfareItem(values: CreateWelfareItemFormValues) {
  const response = await axiosInstance.post(
    welfareStoresPath,
    toWelfareItemPayload(values)
  )
  return response.data
}

/** Saves changes to a welfare item. */
export async function updateWelfareItem(
  welfareItemId: string,
  values: CreateWelfareItemFormValues
) {
  const response = await axiosInstance.patch(
    welfareItemPath(welfareItemId),
    toWelfareItemPayload(values)
  )
  return response.data
}

/** Removes an item from the welfare stores. */
export async function deleteWelfareItem(welfareItemId: string) {
  await axiosInstance.delete(welfareItemPath(welfareItemId))
}

const equipmentPath = "/projects/equipment"

/**
 * Matches `value` to one of `known` case-insensitively, so `good` shows as
 * `Good`. An unknown value passes through.
 */
function toKnown(known: readonly string[], value: string | null | undefined) {
  if (!value) return null
  const lower = value.toLowerCase()
  return known.find((item) => item.toLowerCase() === lower) ?? value
}

function toEquipment(equipment: EquipmentResponse): Equipment {
  return {
    id: equipment.equipment_id,
    assetNumber: equipment.asset_number || null,
    item: equipment.item,
    category: toKnown(equipmentCategories, equipment.category),
    quantity: equipment.qty,
    condition: toKnown(equipmentConditions, equipment.condition),
    assignedProjectId: equipment.assigned_to || null,
    responsibleId: equipment.responsible_id || null,
    issuedDate: equipment.issued_date || null,
    returnDate: equipment.return_date || null,
    purchaseCost: equipment.purchase_cost ?? null,
    maintenanceNotes: equipment.maintenance_notes || null,
  }
}

/** Equipment and tools, by name, narrowed by `filters`. */
export async function listEquipment(filters: EquipmentFilters = {}) {
  const response = await axiosInstance.get<EquipmentResponse[]>(equipmentPath, {
    params: {
      condition: filters.condition,
      assigned_to: filters.assignedTo,
    },
  })
  return response.data
    .map(toEquipment)
    .sort((a, b) => a.item.localeCompare(b.item))
}

/** Adds `value` under `key` only when it isn't blank. */
function optional<K extends string, V extends string | number>(
  key: K,
  value: V | null
) {
  return (value === null || value === "" ? {} : { [key]: value }) as Partial<
    Record<K, V>
  >
}

function toEquipmentPayload(values: CreateEquipmentFormValues) {
  return {
    asset_number: values.assetNumber,
    item: values.item,
    category: values.category,
    qty: values.qty,
    condition: values.condition,
    responsible_id: values.responsibleId,
    issued_date: values.issuedDate,
  }
}

function equipmentItemPath(equipmentId: string) {
  return `${equipmentPath}/${encodeURIComponent(equipmentId)}`
}

/** Adds equipment or tools to the equipment store. Blank optional fields are left out. */
export async function createEquipment(values: CreateEquipmentFormValues) {
  const payload: CreateEquipmentPayload = {
    ...toEquipmentPayload(values),
    ...optional("assigned_to", values.assignedProjectId),
    ...optional("return_date", values.returnDate),
    ...optional("purchase_cost", values.purchaseCost),
    ...optional("maintenance_notes", values.maintenanceNotes),
  }
  const response = await axiosInstance.post(equipmentPath, payload)
  return response.data
}

/**
 * Saves changes to equipment. Blank optional fields are sent as null, so
 * clearing one, e.g. moving it back to the general store, takes effect.
 */
export async function updateEquipment(
  equipmentId: string,
  values: CreateEquipmentFormValues
) {
  const payload: UpdateEquipmentPayload = {
    ...toEquipmentPayload(values),
    assigned_to: values.assignedProjectId || null,
    return_date: values.returnDate || null,
    purchase_cost: values.purchaseCost,
    maintenance_notes: values.maintenanceNotes || null,
  }
  const response = await axiosInstance.patch(
    equipmentItemPath(equipmentId),
    payload
  )
  return response.data
}

/** Removes equipment from the equipment store. */
export async function deleteEquipment(equipmentId: string) {
  await axiosInstance.delete(equipmentItemPath(equipmentId))
}
