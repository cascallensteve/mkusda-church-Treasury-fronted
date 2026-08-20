import * as React from "react"

import { cn } from "@/lib/utils"

const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("Dialog components must be used within Dialog")
  return context
}

function Dialog({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const currentOpen = open ?? internalOpen
  const setOpen = (v: boolean) => {
    setInternalOpen(v)
    onOpenChange?.(v)
  }
  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, ...props }: React.ComponentProps<"button">) {
  const { setOpen } = useDialog()
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { open, setOpen } = useDialog()
  if (!open) return null
  return (
    <div
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
  const { open } = useDialog()
  if (!open) return null
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
