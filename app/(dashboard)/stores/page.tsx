import type { Metadata } from "next"

import { StoresView } from "@/components/stores/stores-view"

export const metadata: Metadata = {
  title: "Stores · Chrysolyte FirmControl",
}

export default function StoresPage() {
  return <StoresView />
}
