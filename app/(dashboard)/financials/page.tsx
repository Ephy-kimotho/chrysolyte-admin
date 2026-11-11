import type { Metadata } from "next"

import { FinancialsView } from "@/components/financials/financials-view"

export const metadata: Metadata = {
  title: "Financials · Chrysolyte FirmControl",
}

export default function FinancialsPage() {
  return <FinancialsView />
}
