'use client'

import { useMemo, useState } from 'react'
import { HandCoins, Plus, Receipt } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatKES, members, tithes as seed } from '@/lib/data'

type Tithe = (typeof seed)[number]
const methods = ['M-Pesa', 'Cash', 'Bank Transfer']

export default function TithesPage() {
  const [list, setList] = useState<Tithe[]>(seed)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ member: '', amount: '', method: 'M-Pesa' })

  const total = useMemo(() => list.reduce((s, t) => s + t.amount, 0), [list])
  const thisMonth = useMemo(
    () => list.filter((t) => t.date.startsWith('2026-07')).reduce((s, t) => s + t.amount, 0),
    [list],
  )

  function record() {
    const amt = Number(form.amount)
    if (!form.member || !amt) return
    const next: Tithe = {
      receipt: `THE-2026-${(497 + list.length).toString().padStart(4, '0')}`,
      member: form.member,
      date: new Date().toISOString().slice(0, 10),
      amount: amt,
      method: form.method,
    }
    setList((prev) => [next, ...prev])
    setForm({ member: '', amount: '', method: 'M-Pesa' })
    setOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Tithe Management"
        description="Record tithes, generate receipts and track member faithfulness."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" />Record Tithe</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Tithe</DialogTitle>
                <DialogDescription>A receipt number will be generated automatically.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Member</Label>
                  <Select value={form.member} onValueChange={(v) => setForm({ ...form, member: v })}>
                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                    <SelectContent>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input id="amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Method</Label>
                    <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {methods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button onClick={record}>Save &amp; Generate Receipt</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HandCoins className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tithe Recorded</p>
              <p className="font-serif text-2xl font-bold">{formatKES(total)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Receipt className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">July 2026</p>
              <p className="font-serif text-2xl font-bold">{formatKES(thisMonth)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-5/15 text-chart-5">
              <Receipt className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receipts Issued</p>
              <p className="font-serif text-2xl font-bold">{list.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Tithe Records</CardTitle>
          <CardDescription>Most recent tithe contributions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((t) => (
                  <TableRow key={t.receipt}>
                    <TableCell className="font-mono text-xs">{t.receipt}</TableCell>
                    <TableCell className="font-medium">{t.member}</TableCell>
                    <TableCell className="text-muted-foreground">{t.date}</TableCell>
                    <TableCell><Badge variant="secondary">{t.method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{formatKES(t.amount)}</TableCell>
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
