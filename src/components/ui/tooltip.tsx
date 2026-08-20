import * as React from "react"

import { cn } from "@/lib/utils"

const TooltipContext = React.createContext<{ open: boolean } | null>(null)

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return children
}

function Tooltip({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <TooltipContext.Provider value={{ open: false }}>
      <div data-slot="tooltip" {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({ children, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return children
  }
  return <div data-slot="tooltip-trigger" {...props}>{children}</div>
}

function TooltipContent({ className, side = "top", sideOffset = 4, children, ...props }: React.ComponentProps<"div"> & { side?: "top" | "bottom" | "left" | "right"; sideOffset?: number }) {
  return (
    <div
      data-slot="tooltip-content"
        className={cn(
          "bg-foreground text-background z-50 max-w-sm rounded-md px-3 py-1.5 text-xs",
          side === "top" && "bottom-full mb-2",
          side === "bottom" && "top-full mt-2",
          side === "left" && "right-full mr-2",
          side === "right" && "left-full ml-2",
          className
        )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
