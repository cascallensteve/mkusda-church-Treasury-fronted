import { Users2, TrendingUp, TrendingDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { departments, formatKES } from "@/lib/data"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Departmental Funds"
        description="Track budgets, income, expenses and balances for each church department."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const balance = d.income - d.expenses
          const usage = Math.min(100, Math.round((d.expenses / d.budget) * 100))
          const positive = balance >= 0
          return (
            <Card key={d.name}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Users2 className="size-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      positive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {positive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                    {formatKES(Math.abs(balance), { compact: true })}
                  </span>
                </div>
                <CardTitle className="pt-2 text-base leading-tight">{d.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Led by {d.leader}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium tabular-nums">{formatKES(d.budget, { compact: true })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatKES(d.income, { compact: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                    <p className="text-sm font-medium tabular-nums text-destructive">
                      {formatKES(d.expenses, { compact: true })}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Budget used</span>
                    <span>{usage}%</span>
                  </div>
                  <Progress value={usage} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
