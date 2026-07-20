import { Wallet, Landmark, Banknote, PiggyBank, Building2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { summary, fundDistribution, bankAccounts, formatKES } from "@/lib/data"

export default function TreasuryPage() {
  const totalFunds = fundDistribution.reduce((s, f) => s + f.amount, 0)
  const totalBank = bankAccounts.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Treasury Overview"
        description="Consolidated view of all church funds, cash and bank positions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Bank Balance" value={formatKES(summary.bankBalance)} icon={Landmark} tone="primary" />
        <StatCard title="Cash on Hand" value={formatKES(summary.cashOnHand)} icon={Banknote} tone="warning" />
        <StatCard title="Building Fund" value={formatKES(summary.buildingFund)} icon={Building2} tone="success" />
        <StatCard
          title="Development Fund"
          value={formatKES(summary.developmentFund)}
          icon={PiggyBank}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fund Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fundDistribution.map((f) => {
              const pct = Math.round((f.amount / totalFunds) * 100)
              return (
                <div key={f.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{f.fund}</span>
                    <span className="tabular-nums text-muted-foreground">{formatKES(f.amount)}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bankAccounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                    <Wallet className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.bank}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.type} &middot; {a.accountNumber}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatKES(a.balance)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-semibold tabular-nums text-primary">{formatKES(totalBank)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
