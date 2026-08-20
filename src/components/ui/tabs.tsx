import * as React from "react"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  setValue: (value: string) => void
} | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tabs components must be used within Tabs")
  return context
}

function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: React.ComponentProps<"div"> & { defaultValue?: string }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const currentValue = value ?? internalValue
  const setValue = (v: string) => {
    setInternalValue(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ value, className, ...props }: React.ComponentProps<"button"> & { value: string }) {
  const { value: currentValue, setValue } = useTabs()
  const isActive = currentValue === value
  return (
    <button
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ value, className, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const { value: currentValue } = useTabs()
  if (currentValue !== value) return null
  return (
    <div
      data-slot="tabs-content"
      data-state={currentValue === value ? "active" : "inactive"}
      className={cn("mt-2 focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
