import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Pinned open so the desktop sidebar never collapses. Below `md` the
    // sidebar is a drawer driven by `openMobile`, which this doesn't affect.
    <SidebarProvider open>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex-1 px-4 pb-4 md:px-6 md:pb-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
