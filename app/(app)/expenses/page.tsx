"use client"

import { useState } from "react"
import { Plus, Search, Upload } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatCard } from "@/components/stat-card"
import { expenses, expenseCategories, formatKES } from "@/lib/data"
import { Wallet, Clock, CheckCircle2 } from "lucide-react"

export default function ExpensesPage() {
  const [query, setQuery] = useState("")

  const filtered = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase()),
  )

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pending = expenses.filter((e) => e.status === "Pending")
  const pendingTotal = pending.reduce((sum, e) => sum + e.amount, 0)
  const approvedTotal = expenses
    .filter((e) => e.status === "Approved")
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expense Management"
        description="Record expenditures, upload receipts and manage the approval workflow."
      >
        <Dialog>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Add Expense
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Expense</DialogTitle>
              <DialogDescription>Submit a new expense for approval.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="payee">Payee</Label>
                <Input id="payee" placeholder="e.g. Tanesco" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ecat">Category</Label>
                <Select>
                  <SelectTrigger id="ecat">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eamount">Amount (KES)</Label>
                <Input id="eamount" type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receipt">Receipt</Label>
                <Button variant="outline" className="justify-start gap-2 font-normal text-muted-foreground">
                  <Upload className="size-4" />
                  Upload receipt (PDF, JPG, PNG)
                </Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <DialogClose render={<Button />}>Submit for Approval</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Expenses" value={formatKES(total)} icon={Wallet} tone="danger" />
        <StatCard
          title="Pending Approval"
          value={formatKES(pendingTotal)}
          icon={Clock}
          tone="warning"
          hint={`${pending.length} awaiting review`}
        />
        <StatCard title="Approved" value={formatKES(approvedTotal)} icon={CheckCircle2} tone="success" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle>Expense Records</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{e.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{e.date}</TableCell>
                    <TableCell className="font-medium">{e.description}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatKES(e.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
