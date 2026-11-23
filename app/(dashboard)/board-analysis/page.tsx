import type { Metadata } from "next"

import { BoardAnalysisView } from "@/components/board-analysis/board-analysis-view"

export const metadata: Metadata = {
  title: "Board Analysis · Chrysolyte FirmControl",
}

export default function BoardAnalysisPage() {
  return <BoardAnalysisView />
}
