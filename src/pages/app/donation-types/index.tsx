'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HandCoins,
  Plus,
  Search,
  Loader2,
  Edit,
  Eye,
  Trash2,
  ArrowLeft,
  BarChart3,
  TrendingDown,
  ArrowDownCircle,
  RefreshCw,
  Wallet,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { api } from '@/lib/api'
import { formatKES } from '@/lib/data'
import { fundsManagementApi, type Adjustment, type Expense, type Allocation } from '@/service/funds-management'

type DonationType = {
  id: number
  name: string
  description: string
  created_by: number
  created_by_email: string
  created_by_name: string
  created_at: string
}

export default function DonationTypesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('types')
  const [donationTypes, setDonationTypes] = useState<DonationType[]>([])
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.getDonationTypes(),
        fundsManagementApi.getAdjustments(),
        fundsManagementApi.getExpenses(),
        fundsManagementApi.getAllocations(),
      ])

      const types = results[0]
      const adj = results[1]
      const exp = results[2]
      const alloc = results[3]

      if (types.status === 'fulfilled') {
        const data = types.value
        setDonationTypes(Array.isArray(data) ? data : data?.results || [])
      } else {
        console.error('Failed to fetch donation types:', types.reason)
      }

      if (adj.status === 'fulfilled') {
        const data = adj.value
        console.log('[Adjustments] API response:', data)
        if (Array.isArray(data)) {
          setAdjustments(data)
        } else if (data?.results && Array.isArray(data.results)) {
          setAdjustments(data.results)
        } else if (data && typeof data === 'object') {
          setAdjustments([data])
        } else {
          setAdjustments([])
        }
      }

      if (exp.status === 'fulfilled') {
        const data = exp.value
        setExpenses(Array.isArray(data) ? data : data?.results || [])
      }

      if (alloc.status === 'fulfilled') {
        const data = alloc.value
        setAllocations(Array.isArray(data) ? data : data?.results || [])
      }
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
        title="Donation Types & Funds"
        description="Manage categories, funds, expenses, and allocations"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/app/donation-types/statistics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Statistics
            </Button>
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
            <StatCard label="Total Types" value={String(donationTypes.length)} icon={HandCoins} accent="primary" />
            <StatCard label="Funds Added" value={formatKES(totalAdjustments)} icon={ArrowDownCircle} accent="emerald" />
            <StatCard label="Total Spent" value={formatKES(totalExpenses + totalAllocations)} icon={TrendingDown} accent="amber" />
            <StatCard label="Net Available" value={formatKES(netFunds)} icon={Wallet} accent="teal" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
            </TabsList>

            <TabsContent value="types">
              <TypesTab
                donationTypes={donationTypes}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={fetchAll}
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

function TypesTab({
  donationTypes,
  searchTerm,
  onSearchChange,
  onRefresh,
}: {
  donationTypes: DonationType[]
  searchTerm: string
  onSearchChange: (v: string) => void
  onRefresh: () => void
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<DonationType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    setIsSubmitting(true)
    try {
      if (selectedType) {
        await api.updateDonationType(selectedType.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        })
        toast.success('Donation type updated')
      } else {
        await api.createDonationType({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        })
        toast.success('Donation type created')
      }
      setIsFormOpen(false)
      setSelectedType(null)
      setFormData({ name: '', description: '' })
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (donationType: DonationType) => {
    setSelectedType(donationType)
    setFormData({ name: donationType.name, description: donationType.description || '' })
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedType) return
    setIsSubmitting(true)
    try {
      await api.deleteDonationType(selectedType.id)
      toast.success('Donation type deleted')
      setIsDeleteDialogOpen(false)
      setSelectedType(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTypes = donationTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isFormOpen) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" onClick={() => { setIsFormOpen(false); setSelectedType(null); setFormData({ name: '', description: '' }) }} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h2 className="text-lg font-semibold">{selectedType ? 'Edit Donation Type' : 'Add New Donation Type'}</h2>
              <p className="text-sm text-muted-foreground">{selectedType ? 'Update details below' : 'Enter details below'}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Tithes, Offerings" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Optional description" rows={3} disabled={isSubmitting} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setSelectedType(null); setFormData({ name: '', description: '' }) }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {selectedType ? 'Save Changes' : 'Create Type'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Donation Types</CardTitle>
            <CardDescription>View and manage donation categories</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => { setSelectedType(null); setFormData({ name: '', description: '' }); setIsFormOpen(true) }}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTypes.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {searchTerm ? 'No types match your search.' : 'No donation types found.'}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{type.description || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{type.created_by_name}</span>
                        <span className="text-xs text-muted-foreground">{type.created_by_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{new Date(type.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(type)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setSelectedType(type); setIsDeleteDialogOpen(true) }}>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Donation Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedType?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Adjustment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Adjustment | null>(null)
  const [form, setForm] = useState({ donation_type: '', amount: '', reason: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', reason: '' })
    setIsFormOpen(true)
  }

  const openEdit = (adj: Adjustment) => {
    setEditing(adj)
    setForm({ donation_type: String(adj.donation_type), amount: adj.amount, reason: adj.reason })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditing(null)
    setForm({ donation_type: '', amount: '', reason: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.donation_type || !form.amount || !form.reason) {
      toast.error('All fields are required')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = { donation_type: Number(form.donation_type), amount: parseFloat(form.amount), reason: form.reason }
      if (editing) {
        await fundsManagementApi.updateAdjustment(editing.id, payload)
        toast.success('Adjustment updated')
      } else {
        await fundsManagementApi.addFunds(payload)
        toast.success('Funds added')
      }
      closeForm()
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fundsManagementApi.deleteAdjustment(deleteTarget.id)
      toast.success('Adjustment deleted')
      setDeleteTarget(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  if (isFormOpen) {
    return (
      <div className="relative min-h-[500px]">
        <Card className="absolute inset-0 z-10 overflow-auto rounded-none border-0 shadow-lg">
          <CardContent className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={closeForm} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{editing ? 'Edit Adjustment' : 'Add Funds'}</h2>
                <p className="text-sm text-muted-foreground">{editing ? 'Update the adjustment details below' : 'Add funds to a donation account'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Donation Type *</Label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>{dt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount (KES) *</Label>
                <Input type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reason *</Label>
                <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for adjustment" rows={4} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Funds'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Fund Adjustments</CardTitle>
          <CardDescription>Manual fund additions and corrections</CardDescription>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Funds
        </Button>
      </CardHeader>
      <CardContent>
        {adjustments.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No adjustments recorded.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Initial Balance</TableHead>
                  <TableHead className="text-right">New Balance</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adj) => (
                  <TableRow key={adj.id}>
                    <TableCell className="font-medium">{donationTypes.find((d) => d.id === adj.donation_type)?.name || `#${adj.donation_type}`}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">+{formatKES(parseFloat(adj.amount))}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground">{adj.reason}</TableCell>
                    <TableCell className="text-right text-sm">{formatKES(parseFloat(adj.initial_balance))}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatKES(parseFloat(adj.new_balance))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {adj.created_by_profile_picture ? (
                            <img src={adj.created_by_profile_picture} alt={adj.created_by_name} className="h-full w-full object-cover" />
                          ) : (
                            <AvatarFallback className="text-[10px] font-medium">
                              {adj.created_by_name?.charAt(0) || 'A'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{adj.created_by_name}</span>
                          <span className="text-[10px] text-muted-foreground">{adj.created_by_email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(adj.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(adj)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(adj)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Adjustment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this adjustment of{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget && formatKES(parseFloat(deleteTarget.amount))}
              </span>
              ? The balance will be recalculated automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)
  const [form, setForm] = useState({ donation_type: '', amount: '', description: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', description: '' })
    setIsFormOpen(true)
  }

  const openEdit = (exp: Expense) => {
    setEditing(exp)
    setForm({ donation_type: String(exp.donation_type), amount: exp.amount, description: exp.description })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditing(null)
    setForm({ donation_type: '', amount: '', description: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.donation_type || !form.amount || !form.description) {
      toast.error('All fields are required')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = { donation_type: Number(form.donation_type), amount: parseFloat(form.amount), description: form.description }
      if (editing) {
        await fundsManagementApi.updateExpense(editing.id, payload)
        toast.success('Expense updated')
      } else {
        await fundsManagementApi.recordExpense(payload)
        toast.success('Expense recorded')
      }
      closeForm()
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fundsManagementApi.deleteExpense(deleteTarget.id)
      toast.success('Expense deleted')
      setDeleteTarget(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  if (isFormOpen) {
    return (
      <div className="relative min-h-[500px]">
        <Card className="absolute inset-0 z-10 overflow-auto rounded-none border-0 shadow-lg">
          <CardContent className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={closeForm} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{editing ? 'Edit Expense' : 'Record New Expense'}</h2>
                <p className="text-sm text-muted-foreground">{editing ? 'Update the expense details below' : 'Enter the expense details below'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Donation Type *</Label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>{dt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount (KES) *</Label>
                <Input type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" rows={4} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Record Expense'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Expenses</CardTitle>
          <CardDescription>Record spending against accounts</CardDescription>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Record Expense
        </Button>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No expenses recorded.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Initial Balance</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{donationTypes.find((d) => d.id === exp.donation_type)?.name || `#${exp.donation_type}`}</TableCell>
                    <TableCell className="font-semibold text-amber-600">-{formatKES(parseFloat(exp.amount))}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground">{exp.description}</TableCell>
                    <TableCell className="text-right text-sm">{formatKES(parseFloat(exp.initial_balance))}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatKES(parseFloat(exp.remaining_balance))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {exp.created_by_profile_picture ? (
                            <img src={exp.created_by_profile_picture} alt={exp.created_by_name} className="h-full w-full object-cover" />
                          ) : (
                            <AvatarFallback className="text-[10px] font-medium">
                              {exp.created_by_name?.charAt(0) || 'A'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{exp.created_by_name}</span>
                          <span className="text-[10px] text-muted-foreground">{exp.created_by_email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(exp.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(exp)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(exp)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Expense
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense of{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget && formatKES(parseFloat(deleteTarget.amount))}
              </span>
              ? The balance will be recalculated automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewingAllocation, setViewingAllocation] = useState<Allocation | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [editing, setEditing] = useState<Allocation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Allocation | null>(null)
  const [form, setForm] = useState({ donation_type: '', amount: '', recipient_name: '', recipient_email: '', purpose: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ donation_type: '', amount: '', recipient_name: '', recipient_email: '', purpose: '' })
    setIsFormOpen(true)
  }

  const openEdit = (alloc: Allocation) => {
    setEditing(alloc)
    setForm({ donation_type: String(alloc.donation_type), amount: alloc.amount, recipient_name: alloc.recipient_name, recipient_email: alloc.recipient_email || '', purpose: alloc.purpose })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditing(null)
    setForm({ donation_type: '', amount: '', recipient_name: '', recipient_email: '', purpose: '' })
  }

  const openView = async (alloc: Allocation) => {
    setViewingAllocation(alloc)
    setIsViewOpen(true)
    setTransactionsLoading(true)
    try {
      const data = await api.getTransactions()
      const allTransactions = data.results || data
      const filtered = allTransactions.filter((tx: any) => tx.donation_type === alloc.donation_type)
      setTransactions(filtered)
    } catch (err: any) {
      toast.error('Failed to load transactions')
    } finally {
      setTransactionsLoading(false)
    }
  }

  const closeView = () => {
    setIsViewOpen(false)
    setViewingAllocation(null)
    setTransactions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.donation_type || !form.amount || !form.recipient_name || !form.purpose) {
      toast.error('All required fields must be filled')
      return
    }
    setIsSubmitting(true)
    try {
      const payload = { donation_type: Number(form.donation_type), amount: parseFloat(form.amount), recipient_name: form.recipient_name, recipient_email: form.recipient_email || undefined, purpose: form.purpose }
      if (editing) {
        await fundsManagementApi.updateAllocation(editing.id, payload)
        toast.success('Allocation updated')
      } else {
        await fundsManagementApi.allocateFunds(payload)
        toast.success('Funds allocated')
      }
      closeForm()
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fundsManagementApi.deleteAllocation(deleteTarget.id)
      toast.success('Allocation deleted')
      setDeleteTarget(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    }
  }

  if (isViewOpen && viewingAllocation) {
    const accountTotal = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    return (
      <div className="relative min-h-[500px]">
        <Card className="absolute inset-0 z-10 overflow-auto rounded-none border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={closeView} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">Allocation Transactions</h2>
                <p className="text-sm text-muted-foreground">{viewingAllocation.recipient_name} - {viewingAllocation.purpose}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Allocated Amount</p>
                <p className="text-xl font-bold text-teal-600">{formatKES(parseFloat(viewingAllocation.amount))}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Account Total (M-Pesa)</p>
                <p className="text-xl font-bold">{formatKES(accountTotal)}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Remaining Balance</p>
                <p className="text-xl font-bold">{formatKES(parseFloat(viewingAllocation.remaining_balance))}</p>
              </div>
            </div>

            <h3 className="text-sm font-medium mb-3">M-Pesa Transactions</h3>
            {transactionsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No M-Pesa transactions found for this allocation.</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">{tx.mpesa_receipt || '—'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{tx.donor_name}</span>
                            <span className="text-xs text-muted-foreground">{tx.donor_email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{tx.phone_number}</TableCell>
                        <TableCell className="text-right font-semibold">{formatKES(parseFloat(tx.amount))}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                            tx.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                            tx.status === 'FAILED' ? 'bg-red-50 text-red-700' :
                            'bg-gray-50 text-gray-700'
                          }`}>
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isFormOpen) {
    return (
      <div className="relative min-h-[500px]">
        <Card className="absolute inset-0 z-10 overflow-auto rounded-none border-0 shadow-lg">
          <CardContent className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={closeForm} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{editing ? 'Edit Allocation' : 'Allocate Funds'}</h2>
                <p className="text-sm text-muted-foreground">{editing ? 'Update allocation details' : 'Allocate funds to a recipient'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Donation Type *</Label>
                <Select value={form.donation_type} onValueChange={(v) => setForm({ ...form, donation_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.id} value={String(dt.id)}>{dt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount (KES) *</Label>
                <Input type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Recipient Name *</Label>
                  <Input value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} placeholder="Recipient name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input type="email" value={form.recipient_email} onChange={(e) => setForm({ ...form, recipient_email: e.target.value })} placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Purpose *</Label>
                <Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Purpose of allocation" rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Allocate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-medium">Allocations</CardTitle>
          <CardDescription>Funds allocated to recipients</CardDescription>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Allocate Funds
        </Button>
      </CardHeader>
      <CardContent>
        {allocations.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No allocations recorded.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((alloc) => (
                  <TableRow key={alloc.id}>
                    <TableCell className="font-medium">{donationTypes.find((d) => d.id === alloc.donation_type)?.name || `#${alloc.donation_type}`}</TableCell>
                    <TableCell className="font-semibold text-teal-600">-{formatKES(parseFloat(alloc.amount))}</TableCell>
                    <TableCell>
                      <div>{alloc.recipient_name}</div>
                      {alloc.recipient_email && <div className="text-xs text-muted-foreground">{alloc.recipient_email}</div>}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground">{alloc.purpose}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatKES(parseFloat(alloc.remaining_balance))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {alloc.allocated_by_profile_picture ? (
                            <img src={alloc.allocated_by_profile_picture} alt={alloc.allocated_by_name} className="h-full w-full object-cover" />
                          ) : (
                            <AvatarFallback className="text-[10px] font-medium">
                              {alloc.allocated_by_name?.charAt(0) || 'A'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{alloc.allocated_by_name}</span>
                          <span className="text-[10px] text-muted-foreground">{alloc.allocated_by_email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(alloc.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" onClick={() => openView(alloc)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(alloc)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(alloc)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Allocation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this allocation of{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget && formatKES(parseFloat(deleteTarget.amount))}
              </span>
              ? The balance will be recalculated automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
