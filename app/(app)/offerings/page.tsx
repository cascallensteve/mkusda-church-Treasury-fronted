import { Gift, Plus } from 'lucide-react'

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
import { formatKES, offerings } from '@/lib/data'

const types = [
  'Sabbath Offering',
  'Thanksgiving Offering',
  'Special Offering',
  'Camp Meeting Offering',
  'Mission Offering',
]

export default function OfferingsPage() {
  const total = offerings.reduce((s, o) => s + o.amount, 0)
  const byType = types.map((t) => ({
    type: t,
    total: offerings.filter((o) => o.type === t).reduce((s, o) => s + o.amount, 0),
  }))

  return (
    <>
      <PageHeader
        title="Offering Management"
        description="Record and track all offering collections across services and events."
        actions={
          <Button>
            <Plus className="size-4" />
            Record Collection
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Gift className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Offerings Collected</p>
              <p className="font-serif text-3xl font-bold">{formatKES(total)}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">FY 2026</Badge>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {byType.map((t) => (
          <Card key={t.type}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{t.type}</p>
              <p className="mt-1 font-serif text-xl font-bold">{formatKES(t.total)}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recent Collections</CardTitle>
          <CardDescription>Offering collections by date and type</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offering Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offerings.map((o, i) => (
                  <TableRow key={`${o.type}-${i}`}>
                    <TableCell className="font-medium">{o.type}</TableCell>
                    <TableCell className="text-muted-foreground">{o.date}</TableCell>
                    <TableCell><Badge variant="secondary">{o.method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{formatKES(o.amount)}</TableCell>
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
