"use client"

import { usePathname } from "next/navigation"

import { UserMenu } from "@/components/user-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useCurrentMinute } from "@/hooks/use-current-minute"
import { formatDateTime } from "@/lib/format"
import { dashboardPages, isNavItemActive } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const now = useCurrentMinute()
  const title = dashboardPages.find((item) =>
    isNavItemActive(pathname, item.href)
  )?.title

  return (
    <header className="flex items-center gap-3 p-4 md:gap-4 md:px-6 md:pt-6 md:pb-4">
      <SidebarTrigger className="-ml-1 size-9 md:hidden print:hidden" />
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="truncate font-heading text-2xl font-bold text-heading md:text-3xl">
          {title}
        </h1>
        {/* Fixed height keeps the title from shifting when the time appears. */}
        <p className="h-5 truncate text-sm text-muted-foreground">
          {now !== null && (
            <time dateTime={new Date(now).toISOString()}>
              {formatDateTime(now)}
            </time>
          )}
        </p>
      </div>
      <UserMenu className="ml-auto print:hidden" />
    </header>
  )
}
