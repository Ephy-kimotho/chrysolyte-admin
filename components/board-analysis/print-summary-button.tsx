"use client"

import { Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintSummaryButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="h-10 rounded-full px-4 font-semibold print:hidden"
    >
      <Printer aria-hidden="true" />
      Print summary
    </Button>
  )
}
