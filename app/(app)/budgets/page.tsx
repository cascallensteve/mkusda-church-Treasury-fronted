import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { BudgetChart } from "@/components/budget-chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { budgets, formatKES, CHURCH } from "@/lib/data"

export default function BudgetsPage() {
  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0)
  const totalActual = budgets.reduce((s, b) => s + b.actual, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Budget Management"
        description={`Yearly budget planning and variance analysis for financial year ${CHURCH.financialYear}.`}
      >
        <Button className="gap-2">
          <Plus className="size-4" />
          New Budget Line
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Allocated</p>
            <p className="text-2xl font-semibold tabular-nums">{formatKES(totalAllocated)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-semibold tabular-nums">{formatKES(totalActual)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-semibold tabular-nums text-success">
              {formatKES(totalAllocated - totalActual)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Allocated vs Actual</CardTitle>
          <CardDescription>Spending against budget by category</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variance Analysis</CardTitle>
          <CardDescription>Difference between allocated and actual spend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((b) => {
                  const variance = b.allocated - b.actual
                  const over = variance < 0
                  return (
                    <TableRow key={b.category}>
                      <TableCell className="font-medium">{b.category}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatKES(b.allocated)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatKES(b.actual)}</TableCell>
                      <TableCell
                        className={`text-right font-medium tabular-nums ${
                          over ? "text-destructive" : "text-success"
                        }`}
                      >
                        {over ? "-" : ""}
                        {formatKES(Math.abs(variance))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            over
                              ? "border-0 bg-destructive/15 text-destructive"
                              : "border-0 bg-success/15 text-success"
                          }
                        >
                          {over ? "Over budget" : "On track"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
