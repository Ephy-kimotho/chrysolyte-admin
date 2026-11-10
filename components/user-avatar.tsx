import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  name: string
  className?: string
}

/** The signed-in user's initials on the brand gradient. */
export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("after:hidden", className)}>
      <AvatarFallback className="bg-linear-to-br from-primary to-accent font-heading font-semibold text-primary-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
