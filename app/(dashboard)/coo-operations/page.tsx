import type { Metadata } from "next"

import { OfficeWorkLog } from "@/components/coo-operations/office-work-log"

export const metadata: Metadata = {
  title: "COO Operations · Chrysolyte FirmControl",
}

export default function CooOperationsPage() {
  return <OfficeWorkLog />
}
