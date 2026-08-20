import * as React from "react"

import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value: string
  setValue: (value: string) => void
} | null>(null)

function useSelect() {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("Select components must be used within Select")
  return context
}

function Select({ value, onValueChange, defaultValue, children, ...props }: React.ComponentProps<"div"> & { defaultValue?: string }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const currentValue = value ?? internalValue
  const setValue = (v: string) => {
    setInternalValue(v)
    onValueChange?.(v)
  }
  return (
    <SelectContext.Provider value={{ value: currentValue, setValue }}>
      <div data-slot="select" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const { value } = useSelect()
  return (
    <button
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <span className="text-muted-foreground">▼</span>
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelect()
  return <span>{value || placeholder}</span>
}

function SelectContent({ className, children, ...props }: React.ComponentProps<"div">) {
  const { open, setOpen } = useSelect()
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
      data-slot="select-content"
      ref={ref}
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectItem({ value, className, children, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const { setValue, value: currentValue } = useSelect()
  const isSelected = currentValue === value
  return (
    <div
      data-slot="select-item"
      data-selected={isSelected}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
