'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { annualOverview, fundDistribution, monthlyIncomeExpense, formatKES } from '@/lib/data'

const ieConfig = {
  income: { label: 'Income', color: 'var(--chart-1)' },
  expenses: { label: 'Expenses', color: 'var(--chart-4)' },
}

const fundColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--accent-foreground)',
]

const fundConfig = fundDistribution.reduce((acc, item, i) => {
  acc[item.key] = { label: item.fund, color: fundColors[i % fundColors.length] }
  return acc
}, {} as Record<string, { label: string; color: string }>)

const shortKES = (v: number) => formatKES(v, { compact: true })

export function IncomeVsExpenseChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-serif">Income vs Expenses</CardTitle>
        <CardDescription>Monthly comparison for FY 2026 (KES)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ieConfig} className="h-[280px] w-full">
          <AreaChart data={monthlyIncomeExpense} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={(v) => shortKES(Number(v))}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(v) => formatKES(Number(v))} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              fill="url(#fillIncome)"
              strokeWidth={2}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              fill="url(#fillExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function FundDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Fund Distribution</CardTitle>
        <CardDescription>Share of total funds collected</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={fundConfig} className="mx-auto aspect-square max-h-[280px]">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="key" formatter={(v) => formatKES(Number(v))} />}
            />
            <Pie data={fundDistribution} dataKey="amount" nameKey="key" innerRadius={55} strokeWidth={3}>
              {fundDistribution.map((entry, i) => (
                <Cell key={entry.key} fill={fundColors[i % fundColors.length]} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              className="flex-wrap gap-1.5 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MonthlyCollectionsChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-serif">Monthly Collections</CardTitle>
        <CardDescription>Total income received each month (KES)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ieConfig} className="h-[260px] w-full">
          <BarChart data={monthlyIncomeExpense} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={(v) => shortKES(Number(v))}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatKES(Number(v))} />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function AnnualOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Annual Financial Overview</CardTitle>
        <CardDescription>Income & expenses by year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ieConfig} className="h-[260px] w-full">
          <LineChart data={annualOverview} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={(v) => shortKES(Number(v))}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatKES(Number(v))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="income" type="monotone" stroke="var(--color-income)" strokeWidth={2.5} dot={false} />
            <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
