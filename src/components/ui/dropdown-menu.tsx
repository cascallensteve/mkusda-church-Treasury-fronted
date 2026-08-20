import * as React from "react"

import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenu components must be used within DropdownMenu")
  return context
}

function DropdownMenu({ children, ...props }: React.ComponentProps<"div">) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div data-slot="dropdown-menu" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen } = useDropdownMenu()
  return (
    <button
      data-slot="dropdown-menu-trigger"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({ className, align = "center", children, ...props }: React.ComponentProps<"div"> & { align?: "start" | "center" | "end" }) {
  const { open, setOpen } = useDropdownMenu()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      data-slot="dropdown-menu-content"
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "start" && "origin-top-left left-0",
        align === "center" && "origin-top-center left-1/2 -translate-x-1/2",
        align === "end" && "origin-top-right right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-group"
      className={cn("p-1", className)}
      {...props}
    />
  )
}

function DropdownMenuItem({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
