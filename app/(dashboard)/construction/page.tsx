import type { Metadata } from "next"

import { ConstructionView } from "@/components/construction/construction-view"

export const metadata: Metadata = {
  title: "Construction · Chrysolyte FirmControl",
}

export default function ConstructionPage() {
  return <ConstructionView />
}
