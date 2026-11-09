import type { Metadata } from "next"
import { DM_Sans, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/providers/query-provider"
import { AuthProvider } from "@/providers/auth-provider"

const dmSansHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Chrysolyte FirmControl",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        dmSansHeading.variable
      )}
    >
      <body>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
