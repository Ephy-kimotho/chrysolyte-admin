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
import { useLogout } from "@/hooks/use-logout"
import { getHomeRoute, getNavItems, isNavItemActive } from "@/lib/navigation"
import { useAuth } from "@/providers/auth-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const logoutMutation = useLogout()
  const { user } = useAuth()
  const items = getNavItems(user)

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
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavItemActive(pathname, item.href)}
                    className="h-11 rounded-lg px-3"
                  >
                    <Link href={item.href} onClick={closeMobileSidebar}>
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
