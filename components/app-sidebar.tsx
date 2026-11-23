"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useLogout } from "@/hooks/use-logout"
import { pluralize } from "@/lib/format"
import { getHomeRoute, getNavItems, isNavItemActive } from "@/lib/navigation"
import { useAuth } from "@/providers/auth-provider"

const ANNOUNCEMENTS_HREF = "/announcements"

/** A count pill in the top-right corner of a sidebar link. */
function NavBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1.5 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-[0.6875rem] leading-none font-semibold text-sidebar-primary-foreground tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const logoutMutation = useLogout()
  const { user } = useAuth()
  const items = getNavItems(user)

  // Shares the announcements page's cache, so publishing or removing one
  // updates the count. Skipped for users without the Announcements link.
  const announcements = useAnnouncements({
    enabled: items.some((item) => item.href === ANNOUNCEMENTS_HREF),
  })
  const announcementCount = announcements.data?.length ?? 0

  function getBadgeCount(href: string) {
    return href === ANNOUNCEMENTS_HREF ? announcementCount : 0
  }

  // The mobile drawer stays open across client navigation unless closed here.
  const closeMobileSidebar = () => setOpenMobile(false)

  return (
    <Sidebar>
      <SidebarHeader className="gap-4 p-4">
        <Link
          href={user ? getHomeRoute(user) : "/dashboard"}
          onClick={closeMobileSidebar}
          className="w-fit rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Image
            src="/assets/images/logo.png"
            alt="Chrysolyte"
            width={150}
            height={75}
            loading="eager"
            className="opacity-80"
          />
        </Link>
        <p className="text-xs tracking-[0.15em] uppercase">
          Chrysolyte FirmControl
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-4 py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const badgeCount = getBadgeCount(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isNavItemActive(pathname, item.href)}
                      // Room on the right so a badge doesn't cover the title.
                      className={
                        badgeCount > 0
                          ? "h-11 rounded-lg pr-12 pl-3"
                          : "h-11 rounded-lg px-3"
                      }
                    >
                      <Link href={item.href} onClick={closeMobileSidebar}>
                        {item.title}
                        {badgeCount > 0 && (
                          <span className="sr-only">
                            {" "}
                            ({badgeCount}{" "}
                            {pluralize(
                              badgeCount,
                              "announcement",
                              "announcements"
                            )}
                            )
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                    {badgeCount > 0 && <NavBadge count={badgeCount} />}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full font-bold"
          disabled={logoutMutation.isPending}
          onClick={() => {
            closeMobileSidebar()
            logoutMutation.mutate()
          }}
        >
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
