"use client"

import { usePathname } from "next/navigation"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { isNavItemActive, navItems } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const title = navItems.find((item) =>
    isNavItemActive(pathname, item.href)
  )?.title

  return (
    <header className="flex items-center gap-3 p-4 md:gap-4 md:px-6 md:pt-6 md:pb-4">
      <SidebarTrigger className="-ml-1 size-9" />
      <h1 className="min-w-0 truncate font-heading text-2xl font-bold text-heading md:text-3xl">
        {title}
      </h1>
    </header>
  )
}
