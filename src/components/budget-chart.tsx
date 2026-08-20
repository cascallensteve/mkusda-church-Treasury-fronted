'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { budgets, formatKES } from '@/lib/data'

const budgetConfig = budgets.reduce((acc, item, i) => {
  acc[item.category] = { label: item.category, color: `var(--chart-${(i % 5) + 1})` }
  return acc
}, {} as Record<string, { label: string; color: string }>)

const data = budgets.map((b) => ({
  category: b.category,
  allocated: b.allocated,
  actual: b.actual,
}))

const shortKES = (v: number) => formatKES(v, { compact: true })

export function BudgetChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Budget vs Actual</CardTitle>
        <CardDescription>FY 2026 spending by category (KES)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={budgetConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} interval={0} angle={-45} textAnchor="end" height={80} />
            <YAxis tickLine={false} axisLine={false} width={54} tickFormatter={(v) => shortKES(Number(v))} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatKES(Number(v))} />} />
            <Bar dataKey="allocated" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
