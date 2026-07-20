import { Plus, TrendingUp } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatKES, income } from '@/lib/data'

export default function IncomePage() {
  const total = income.reduce((s, i) => s + i.amount, 0)
  const funds = Array.from(new Set(income.map((i) => i.fund)))

  return (
    <>
      <PageHeader
        title="Income"
        description="All income received into church funds and accounts."
        actions={
          <Button>
            <Plus className="size-4" />
            Add Income
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="font-serif text-2xl font-bold">{formatKES(total)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="font-serif text-2xl font-bold">{income.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Funds Credited</p>
            <p className="font-serif text-2xl font-bold">{funds.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Income Ledger</CardTitle>
          <CardDescription>Recorded income transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {income.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.id}</TableCell>
                    <TableCell className="font-medium">{i.source}</TableCell>
                    <TableCell><Badge variant="secondary">{i.fund}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{i.date}</TableCell>
                    <TableCell className="text-muted-foreground">{i.method}</TableCell>
                    <TableCell className="text-right font-medium text-success">{formatKES(i.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
