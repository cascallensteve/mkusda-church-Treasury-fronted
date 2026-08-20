import * as React from "react"

import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("Sidebar components must be used within SidebarProvider")
  return context
}

function SidebarProvider({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"div">) {
  const { open, setOpen } = useSidebar()
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-sidebar-border transition-transform",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarRail() {
  return <div data-slot="sidebar-rail" className="absolute inset-y-0 right-0 w-px bg-sidebar-border" />
}

function SidebarInset({ children, className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex flex-1 flex-col", className)}
      {...props}
    >
      {children}
    </main>
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("relative flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn("text-sidebar-foreground/70 px-2 py-1 text-xs font-medium", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuButton({ isActive, className, children, ...props }: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("border-b border-sidebar-border", className)}
      {...props}
    />
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarRail,
  SidebarInset,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
}
