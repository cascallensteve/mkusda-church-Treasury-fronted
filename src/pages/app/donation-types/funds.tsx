'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  Loader2,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { fundsManagementApi, type Adjustment, type Expense, type Allocation } from '@/service/funds-management'
import { api } from '@/lib/api'
import { formatKES } from '@/lib/data'

type DonationType = {
  id: number
  name: string
  balance?: string
}

export default function FundsManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [donationTypes, setDonationTypes] = useState<DonationType[]>([])
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [types, adj, exp, alloc] = await Promise.all([
        api.getDonationTypes(),
        fundsManagementApi.getAdjustments(),
        fundsManagementApi.getExpenses(),
        fundsManagementApi.getAllocations(),
      ])
      setDonationTypes(Array.isArray(types) ? types : types.results || [])
      setAdjustments(Array.isArray(adj) ? adj : adj.results || [])
      setExpenses(Array.isArray(exp) ? exp : exp.results || [])
      setAllocations(Array.isArray(alloc) ? alloc : alloc.results || [])
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAll()
    toast.success('Data refreshed')
  }

  const totalAdjustments = adjustments.reduce((sum, a) => sum + parseFloat(a.amount), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  const totalAllocations = allocations.reduce((sum, a) => sum + parseFloat(a.amount), 0)
  const netFunds = totalAdjustments - totalExpenses - totalAllocations

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Account Funds"
        description="Manage funds across donation type accounts"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Funds Added"
              value={formatKES(totalAdjustments)}
              icon={ArrowDownCircle}
              accent="primary"
            />
            <StatCard
              label="Total Spent"
              value={formatKES(totalExpenses)}
              icon={TrendingDown}
              accent="amber"
            />
            <StatCard
              label="Total Allocated"
              value={formatKES(totalAllocations)}
              icon={Users}
              accent="teal"
            />
            <StatCard
              label="Net Available"
              value={formatKES(netFunds)}
              icon={netFunds >= 0 ? TrendingUp : TrendingDown}
              accent="emerald"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab
                donationTypes={donationTypes}
                adjustments={adjustments}
                expenses={expenses}
                allocations={allocations}
              />
            </TabsContent>

            <TabsContent value="adjustments">
              <AdjustmentsTab
                donationTypes={donationTypes}
                adjustments={adjustments}
                onRefresh={fetchAll}
              />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpensesTab
                donationTypes={donationTypes}
                expenses={expenses}
                onRefresh={fetchAll}
              />
            </TabsContent>

            <TabsContent value="allocations">
              <AllocationsTab
                donationTypes={donationTypes}
                allocations={allocations}
                onRefresh={fetchAll}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function OverviewTab({
  donationTypes,
  adjustments,
  expenses,
  allocations,
}: {
  donationTypes: DonationType[]
  adjustments: Adjustment[]
  expenses: Expense[]
  allocations: Allocation[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {donationTypes.map((dt) => {
        const dtAdj = adjustments.filter((a) => a.donation_type === dt.id).reduce((s, a) => s + parseFloat(a.amount), 0)
        const dtExp = expenses.filter((e) => e.donation_type === dt.id).reduce((s, e) => s + parseFloat(e.amount), 0)
        const dtAlloc = allocations.filter((a) => a.donation_type === dt.id).reduce((s, a) => s + parseFloat(a.amount), 0)
        const balance = dtAdj - dtExp - dtAlloc

        return (
          <Card key={dt.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">{dt.name}</CardTitle>
              <CardDescription>Account balance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{formatKES(balance)}</p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ArrowDownCircle className="h-3 w-3 text-primary" />
                  {formatKES(dtAdj)}
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpCircle className="h-3 w-3 text-amber-500" />
                  {formatKES(dtExp + dtAlloc)}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
      {donationTypes.length === 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardContent className="py-10 text-center text-muted-foreground">
            No donation types found. Create donation types to manage funds.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AdjustmentsTab({
  donationTypes,
  adjustments,
  onRefresh,
}: {
  donationTypes: DonationType[]
  adjustments: Adjustment[]
  onRefresh: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Adjustment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ donation_type: '', amount: '', reason: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', reason: '' })
    setDialogOpen(true)
  }

  const openEdit = (adj: Adjustment) => {
    setEditing(adj)
    setForm({
      donation_type: String(adj.donation_type),
      amount: adj.amount,
      reason: adj.reason,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.donation_type || !form.amount || !form.reason) {
      toast.error('All fields are required')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        donation_type: Number(form.donation_type),
        amount: parseFloat(form.amount),
        reason: form.reason,
      }
      if (editing) {
        await fundsManagementApi.updateAdjustment(editing.id, payload)
        toast.success('Adjustment updated')
      } else {
        await fundsManagementApi.addFunds(payload)
        toast.success('Funds added successfully')
      }
      setDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this adjustment? The balance will be recalculated.')) return
    try {
      await fundsManagementApi.deleteAdjustment(id)
      toast.success('Adjustment deleted')
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Fund Adjustments</CardTitle>
          <CardDescription>Manual fund additions and corrections</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Adjustment' : 'Add Funds'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update the adjustment details' : 'Add funds to a donation type account'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Donation Type</label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>
                        {dt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (KES)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for adjustment"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Update' : 'Add Funds'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {adjustments.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No adjustments recorded yet.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>New Balance</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adj) => (
                  <TableRow key={adj.id}>
                    <TableCell className="font-medium">
                      {donationTypes.find((d) => d.id === adj.donation_type)?.name || `#${adj.donation_type}`}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">+{formatKES(parseFloat(adj.amount))}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{adj.reason}</TableCell>
                    <TableCell>{formatKES(parseFloat(adj.new_balance))}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(adj.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(adj)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(adj.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ExpensesTab({
  donationTypes,
  expenses,
  onRefresh,
}: {
  donationTypes: DonationType[]
  expenses: Expense[]
  onRefresh: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ donation_type: '', amount: '', description: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (exp: Expense) => {
    setEditing(exp)
    setForm({
      donation_type: String(exp.donation_type),
      amount: exp.amount,
      description: exp.description,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.donation_type || !form.amount || !form.description) {
      toast.error('All fields are required')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        donation_type: Number(form.donation_type),
        amount: parseFloat(form.amount),
        description: form.description,
      }
      if (editing) {
        await fundsManagementApi.updateExpense(editing.id, payload)
        toast.success('Expense updated')
      } else {
        await fundsManagementApi.recordExpense(payload)
        toast.success('Expense recorded')
      }
      setDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense? The balance will be recalculated.')) return
    try {
      await fundsManagementApi.deleteExpense(id)
      toast.success('Expense deleted')
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Expenses</CardTitle>
          <CardDescription>Record spending against donation accounts</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Record Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Expense' : 'Record Expense'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update the expense details' : 'Record a new expense'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Donation Type</label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>
                        {dt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (KES)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What was this expense for?"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Update' : 'Record'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No expenses recorded yet.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">
                      {donationTypes.find((d) => d.id === exp.donation_type)?.name || `#${exp.donation_type}`}
                    </TableCell>
                    <TableCell className="font-semibold text-amber-600">-{formatKES(parseFloat(exp.amount))}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{exp.description}</TableCell>
                    <TableCell>{formatKES(parseFloat(exp.remaining_balance))}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(exp)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(exp.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AllocationsTab({
  donationTypes,
  allocations,
  onRefresh,
}: {
  donationTypes: DonationType[]
  allocations: Allocation[]
  onRefresh: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Allocation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ donation_type: '', amount: '', recipient_name: '', recipient_email: '', purpose: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', recipient_name: '', recipient_email: '', purpose: '' })
    setDialogOpen(true)
  }

  const openEdit = (alloc: Allocation) => {
    setEditing(alloc)
    setForm({
      donation_type: String(alloc.donation_type),
      amount: alloc.amount,
      recipient_name: alloc.recipient_name,
      recipient_email: alloc.recipient_email || '',
      purpose: alloc.purpose,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.donation_type || !form.amount || !form.recipient_name || !form.purpose) {
      toast.error('All required fields must be filled')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        donation_type: Number(form.donation_type),
        amount: parseFloat(form.amount),
        recipient_name: form.recipient_name,
        recipient_email: form.recipient_email || undefined,
        purpose: form.purpose,
      }
      if (editing) {
        await fundsManagementApi.updateAllocation(editing.id, payload)
        toast.success('Allocation updated')
      } else {
        await fundsManagementApi.allocateFunds(payload)
        toast.success('Funds allocated')
      }
      setDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this allocation? The balance will be recalculated.')) return
    try {
      await fundsManagementApi.deleteAllocation(id)
      toast.success('Allocation deleted')
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Allocations</CardTitle>
          <CardDescription>Funds allocated to recipients</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Allocate Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Allocation' : 'Allocate Funds'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update allocation details' : 'Allocate funds to a recipient'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Donation Type</label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>
                        {dt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (KES)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Name</label>
                  <Input
                    value={form.recipient_name}
                    onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
                    placeholder="Recipient name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email (optional)</label>
                  <Input
                    type="email"
                    value={form.recipient_email}
                    onChange={(e) => setForm({ ...form, recipient_email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purpose</label>
                <Textarea
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  placeholder="Purpose of allocation"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Update' : 'Allocate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allocations.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No allocations recorded yet.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((alloc) => (
                  <TableRow key={alloc.id}>
                    <TableCell className="font-medium">
                      {donationTypes.find((d) => d.id === alloc.donation_type)?.name || `#${alloc.donation_type}`}
                    </TableCell>
                    <TableCell className="font-semibold text-teal-600">-{formatKES(parseFloat(alloc.amount))}</TableCell>
                    <TableCell>
                      <div>{alloc.recipient_name}</div>
                      {alloc.recipient_email && (
                        <div className="text-xs text-muted-foreground">{alloc.recipient_email}</div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{alloc.purpose}</TableCell>
                    <TableCell>{formatKES(parseFloat(alloc.remaining_balance))}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(alloc.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(alloc)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(alloc.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
