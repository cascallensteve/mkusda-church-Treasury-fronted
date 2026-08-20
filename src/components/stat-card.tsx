import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'primary',
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: number
  accent?: 'primary' | 'emerald' | 'amber' | 'teal'
}) {
  const up = (trend ?? 0) >= 0

  const accentClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-secondary text-secondary-foreground',
    amber: 'bg-warning/15 text-warning-foreground',
    teal: 'bg-chart-5/15 text-chart-5',
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-serif text-2xl font-bold tracking-tight">{value}</p>
          {trend !== undefined ? (
            <div className="flex items-center gap-1 text-xs font-medium">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5',
                  up ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
                )}
              >
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          ) : null}
        </div>
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', accentClasses[accent])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
