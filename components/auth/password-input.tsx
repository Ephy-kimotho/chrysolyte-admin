"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { authInputClassName } from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn(authInputClassName, "pr-11", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        // Centered with `inset-y-0 my-auto`, not a translate: the button's
        // press effect also sets translate-y, which made the icon jump. The
        // press nudge is turned off so the toggle stays put while clicked.
        className="absolute inset-y-0 right-1.5 my-auto rounded-lg text-muted-foreground hover:text-foreground active:not-aria-[haspopup]:translate-y-0"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  )
}
