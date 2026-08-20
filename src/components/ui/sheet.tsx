import * as React from "react"

import { cn } from "@/lib/utils"

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("Sheet components must be used within Sheet")
  return context
}

function Sheet({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const currentOpen = open ?? internalOpen
  const setOpen = (v: boolean) => {
    setInternalOpen(v)
    onOpenChange?.(v)
  }
  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ children, ...props }: React.ComponentProps<"button">) {
  const { setOpen } = useSheet()
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

function SheetClose({ children, ...props }: React.ComponentProps<"button">) {
  const { setOpen } = useSheet()
  return (
    <button onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  )
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { open, setOpen } = useSheet()
  if (!open) return null
  return (
    <div
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}

function SheetContent({ className, side = "right", children, ...props }: React.ComponentProps<"div"> & { side?: "top" | "right" | "bottom" | "left" }) {
  const { open } = useSheet()
  if (!open) return null

  const sideClasses = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r",
    right: "inset-y-0 right-0 h-full w-3/4 border-l",
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
