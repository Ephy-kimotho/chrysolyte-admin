import type { Metadata } from "next"

import { DesignView } from "@/components/design/design-view"

export const metadata: Metadata = {
  title: "Design Portal · Chrysolyte FirmControl",
}

export default function DesignPortalPage() {
  return <DesignView />
}
