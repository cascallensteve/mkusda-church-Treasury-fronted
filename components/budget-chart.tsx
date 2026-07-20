"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { budgets } from "@/lib/data"

const config = {
  allocated: { label: "Allocated", color: "var(--chart-3)" },
  actual: { label: "Actual", color: "var(--chart-1)" },
} satisfies ChartConfig

const data = budgets.map((b) => ({
  category: b.category,
  allocated: b.allocated,
  actual: b.actual,
}))

export function BudgetChart() {
  return (
    <ChartContainer config={config} className="h-[360px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="category"
          width={120}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="allocated" fill="var(--color-allocated)" radius={[0, 4, 4, 0]} />
        <Bar dataKey="actual" fill="var(--color-actual)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
