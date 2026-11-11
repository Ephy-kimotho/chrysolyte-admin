import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  name: string
  /** Profile photo; initials show while it loads or when there isn't one. */
  src?: string | null
  className?: string
}

/** A person's photo, or their initials on the brand gradient. */
export function UserAvatar({ name, src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("after:hidden", className)}>
      {src && <AvatarImage src={src} alt={`Photo of ${name}`} />}
      <AvatarFallback className="bg-linear-to-br from-primary to-accent font-heading font-semibold text-primary-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
