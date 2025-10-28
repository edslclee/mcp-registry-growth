import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-800 bg-gray-900 text-gray-100 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
