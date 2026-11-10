"use client"

import Link from "next/link"
import { ChevronDown, LogOut, UserRound } from "lucide-react"

import { UserAvatar } from "@/components/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/use-logout"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

/** Header pill for the signed-in user, with links to their profile and sign out. */
export function UserMenu({ className }: { className?: string }) {
  const { user } = useAuth()
  const logoutMutation = useLogout()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex shrink-0 items-center gap-2.5 rounded-full border bg-card p-1 outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-secondary md:pr-3",
          className
        )}
        aria-label={`Account menu for ${user.full_name}`}
      >
        <UserAvatar name={user.full_name} className="size-9 text-xs" />
        {/* Only the avatar fits beside the title on small screens. */}
        <span className="hidden min-w-0 flex-col text-left md:flex">
          <span className="max-w-48 truncate text-sm font-semibold">
            {user.full_name}
          </span>
          <span className="max-w-48 truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-4 text-muted-foreground md:block"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-1.5">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {user.full_name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="h-9 px-2">
          <Link href="/profile">
            <UserRound aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="h-9 px-2"
          disabled={logoutMutation.isPending}
          onSelect={() => logoutMutation.mutate()}
        >
          <LogOut aria-hidden="true" />
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
