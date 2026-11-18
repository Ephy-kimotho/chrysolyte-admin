"use client"

import { Toaster } from "react-hot-toast"

import { useIsMobile } from "@/hooks/use-mobile"

/**
 * Toasts in the app's palette. react-hot-toast styles with inline CSS, so the
 * theme's CSS variables are passed in directly.
 */
export function AppToaster() {
  const isMobile = useIsMobile()

  return (
    <Toaster
      // Top on phones, clear of the thumb; bottom right on wider screens,
      // clear of the page header.
      position={isMobile ? "top-center" : "top-right"}
      gutter={10}
      toastOptions={{
        duration: 4000,
        className: "print:hidden",
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "10px 12px",
          fontSize: "0.875rem",
          lineHeight: 1.45,
          maxWidth: "min(26rem, calc(100vw - 2rem))",
          boxShadow: "0 16px 40px -12px rgb(0 0 0 / 0.6)",
        },
        success: {
          iconTheme: {
            primary: "var(--success)",
            secondary: "var(--success-muted)",
          },
        },
        // Errors stay up longer, since they usually need reading.
        error: {
          duration: 6000,
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--destructive-muted)",
          },
        },
      }}
    />
  )
}
