import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContext = React.createContext<{ config?: Record<string, { label?: string; color?: string }> }>({})

function useChart() {
  return React.useContext(ChartContext)
}

function ChartContainer({ className, config, children, ...props }: React.ComponentProps<"div"> & { config?: Record<string, { label?: string; color?: string }> }) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart-container"
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

function ChartLegend({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-legend"
      className={cn("flex items-center justify-center gap-4 text-sm", className)}
      {...props}
    />
  )
}

function ChartLegendContent({ nameKey }: { nameKey?: string }) {
  const { config } = useChart()
  if (!config) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
      {Object.entries(config).map(([key, item]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.label || key}</span>
        </div>
      ))}
    </div>
  )
}

function ChartTooltip({ content, ...props }: React.ComponentProps<"div"> & { content?: React.ReactNode }) {
  return <div data-slot="chart-tooltip" {...props}>{content}</div>
}

function ChartTooltipContent({ formatter, labelFormatter, ...props }: React.ComponentProps<"div"> & { formatter?: (value: unknown) => string; labelFormatter?: (label: string) => string }) {
  return <div data-slot="chart-tooltip-content" {...props} />
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
