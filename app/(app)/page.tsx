import {
  Banknote,
  Building2,
  Coins,
  Gift,
  HandCoins,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AnnualOverviewChart,
  FundDistributionChart,
  IncomeVsExpenseChart,
  MonthlyCollectionsChart,
} from '@/components/dashboard-charts'
import { CHURCH, formatKES, notifications, summary, summaryTrends } from '@/lib/data'

const cards = [
  { label: 'Total Income', value: summary.totalIncome, icon: TrendingUp, trend: summaryTrends.totalIncome, accent: 'primary' as const },
  { label: 'Total Expenses', value: summary.totalExpenses, icon: TrendingDown, trend: summaryTrends.totalExpenses, accent: 'amber' as const },
  { label: 'Bank Balance', value: summary.bankBalance, icon: Landmark, trend: summaryTrends.bankBalance, accent: 'emerald' as const },
  { label: 'Cash on Hand', value: summary.cashOnHand, icon: Wallet, trend: summaryTrends.cashOnHand, accent: 'teal' as const },
  { label: 'Tithe Received', value: summary.titheReceived, icon: HandCoins, trend: summaryTrends.titheReceived, accent: 'primary' as const },
  { label: 'Offering Received', value: summary.offeringReceived, icon: Gift, trend: summaryTrends.offeringReceived, accent: 'emerald' as const },
  { label: 'Building Fund', value: summary.buildingFund, icon: Building2, trend: summaryTrends.buildingFund, accent: 'teal' as const },
  { label: 'Development Fund', value: summary.developmentFund, icon: Coins, trend: summaryTrends.developmentFund, accent: 'amber' as const },
]

const kindStyles: Record<string, string> = {
  warning: 'bg-warning/15 text-warning-foreground',
  danger: 'bg-destructive/15 text-destructive',
  info: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/15 text-success',
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`${CHURCH.tagline} — Financial Year ${CHURCH.financialYear}`}
        actions={
          <>
            <Button variant="outline">
              <Banknote className="size-4" />
              Record Income
            </Button>
            <Button>
              <HandCoins className="size-4" />
              Record Tithe
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={formatKES(c.value, { compact: true })}
            icon={c.icon}
            trend={c.trend}
            accent={c.accent}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <IncomeVsExpenseChart />
        <FundDistributionChart />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MonthlyCollectionsChart />
        <AnnualOverviewChart />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Net Position</CardTitle>
            <CardDescription>Surplus after expenses this financial year</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Net Surplus</p>
              <p className="font-serif text-3xl font-bold text-primary">
                {formatKES(summary.totalIncome - summary.totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reserves</p>
              <p className="font-serif text-3xl font-bold">
                {formatKES(summary.bankBalance + summary.cashOnHand)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restricted Funds</p>
              <p className="font-serif text-3xl font-bold">
                {formatKES(summary.buildingFund + summary.developmentFund)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Notifications</CardTitle>
            <CardDescription>Alerts &amp; reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((n) => (
              <div key={n.title} className="flex items-start gap-3">
                <Badge className={`mt-0.5 shrink-0 border-0 capitalize ${kindStyles[n.kind]}`}>
                  {n.kind}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
