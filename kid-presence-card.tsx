import { Clock, TriangleAlert } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type Kid, fullName, kidInitials } from "@/lib/mock-data"

export function KidPresenceCard({ kid }: { kid: Kid }) {
  const hasAlert = Boolean(kid.allergies || kid.medical)

  return (
    <button
      type="button"
      className="group relative flex w-40 shrink-0 flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition-all hover:border-accent hover:shadow-md"
    >
      {hasAlert && (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <TriangleAlert className="size-3.5" />
              </span>
            }
          />
          <TooltipContent>{kid.allergies ?? kid.medical}</TooltipContent>
        </Tooltip>
      )}

      <Avatar className="size-14 border-2 border-accent/40">
        <AvatarFallback className="bg-secondary text-base font-semibold text-primary">
          {kidInitials(kid)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{fullName(kid)}</p>
        <p className="text-xs text-muted-foreground">{kid.age} years · Room {kid.room}</p>
      </div>

      <span className="mt-1 flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-primary">
        <Clock className="size-3" />
        {kid.entryTime}
      </span>
    </button>
  )
}
