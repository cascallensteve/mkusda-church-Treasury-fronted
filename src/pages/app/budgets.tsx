'use client'

import { useState } from 'react'
import { Wallet, TrendingUp, AlertTriangle, Target, Search, ArrowLeft, Loader2, CheckCircle2, Edit, Trash2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CHURCH, formatKES, budgets as initialBudgets } from '@/lib/data'

type Budget = {
  category: string
  allocated: number
  actual: number
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  const [formData, setFormData] = useState({
    category: '',
    allocated: '',
    actual: '',
  })

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalActual = budgets.reduce((sum, b) => sum + b.actual, 0)
  const remainingBudget = totalAllocated - totalActual
  const overBudgetCount = budgets.filter(b => b.actual > b.allocated).length

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch = budget.category.toLowerCase().includes(searchTerm.toLowerCase())
    const budgetStatus = budget.actual > budget.allocated ? 'over' : budget.actual > budget.allocated * 0.8 ? 'near' : 'good'
    const matchesStatus = selectedStatus === 'all' || budgetStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getBudgetStatus = (budget: Budget) => {
    if (budget.actual > budget.allocated) return 'over'
    if (budget.actual > budget.allocated * 0.8) return 'near'
    return 'good'
  }

  const getProgressColor = (budget: Budget) => {
    const ratio = budget.actual / budget.allocated
    if (ratio > 1) return 'bg-rose-500'
    if (ratio > 0.8) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newBudget: Budget = {
        category: formData.category,
        allocated: Number(formData.allocated) || 0,
        actual: Number(formData.actual) || 0,
      }
      setBudgets([...budgets, newBudget])
      setFormData({ category: '', allocated: '', actual: '' })
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget)
    setFormData({
      category: budget.category,
      allocated: String(budget.allocated),
      actual: String(budget.actual),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBudget) return
    setIsLoading(true)
    setTimeout(() => {
      setBudgets(budgets.map(b =>
        b.category === selectedBudget.category ? {
          ...b,
          category: formData.category,
          allocated: Number(formData.allocated) || 0,
          actual: Number(formData.actual) || 0,
        } : b
      ))
      setIsEditDialogOpen(false)
      setIsLoading(false)
      setSelectedBudget(null)
      setFormData({ category: '', allocated: '', actual: '' })
    }, 800)
  }

  const handleDelete = (budget: Budget) => {
    if (window.confirm(`Are you sure you want to delete ${budget.category}?`)) {
      setBudgets(budgets.filter(b => b.category !== budget.category))
    }
  }

  const handleView = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Budgets"
          description={`Annual budget allocation and actual spending overview for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Target className="w-4 h-4" />
              Manage Budgets
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Allocated" value={formatKES(totalAllocated, { compact: true })} icon={Wallet} accent="primary" />
          <StatCard label="Total Actual" value={formatKES(totalActual, { compact: true })} icon={TrendingUp} accent="emerald" />
          <StatCard label="Remaining" value={formatKES(remainingBudget, { compact: true })} icon={Target} accent="teal" />
          <StatCard label="Over Budget" value={`${overBudgetCount} items`} icon={AlertTriangle} accent="amber" />
        </div>

        {isDialogOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Add New Budget Category</h2>
                  <p className="text-sm text-muted-foreground">Enter the budget category details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category">Category Name *</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allocated">Allocated Amount (KES) *</Label>
                    <Input id="allocated" name="allocated" type="number" value={formData.allocated} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actual">Actual Spending (KES) *</Label>
                    <Input id="actual" name="actual" type="number" value={formData.actual} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Add Budget</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif">Budget Overview</CardTitle>
                  <CardDescription>
                    {filteredBudgets.length} budget categories tracked
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="good">On Track</SelectItem>
                      <SelectItem value="near">Near Limit</SelectItem>
                      <SelectItem value="over">Over Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Allocated</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No budget categories found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBudgets.map((budget, index) => {
                        const status = getBudgetStatus(budget)
                        const progress = Math.min((budget.actual / budget.allocated) * 100, 100)
                        const remaining = budget.allocated - budget.actual
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{budget.category}</TableCell>
                            <TableCell className="text-right">{formatKES(budget.allocated)}</TableCell>
                            <TableCell className="text-right font-medium">{formatKES(budget.actual)}</TableCell>
                            <TableCell className={`text-right ${remaining < 0 ? 'text-rose-600' : 'text-gray-600'}`}>
                              {formatKES(Math.abs(remaining))}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
                                  <div className={`h-full rounded-full ${getProgressColor(budget)}`} style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <StatusBadge status={status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(budget)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(budget)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Budget Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedBudget && (
              <>
                <DialogHeader>
                  <DialogTitle>Budget Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedBudget.category}</h3>
                    <StatusBadge status={getBudgetStatus(selectedBudget)} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Allocated</span><span className="font-medium">{formatKES(selectedBudget.allocated)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Actual</span><span className="font-medium">{formatKES(selectedBudget.actual)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Remaining</span><span className={`font-medium ${selectedBudget.allocated - selectedBudget.actual < 0 ? 'text-rose-600' : ''}`}>{formatKES(Math.abs(selectedBudget.allocated - selectedBudget.actual))}</span></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Budget Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Budget Category</DialogTitle>
              <DialogDescription>Update the budget details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-category">Category Name *</Label>
                  <Input id="edit-category" name="category" value={formData.category} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-allocated">Allocated Amount (KES) *</Label>
                  <Input id="edit-allocated" name="allocated" type="number" value={formData.allocated} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-actual">Actual Spending (KES) *</Label>
                  <Input id="edit-actual" name="actual" type="number" value={formData.actual} onChange={handleInputChange} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <footer className="border-t bg-white mt-8">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-gray-500">{CHURCH.system} • {CHURCH.location}</p>
            <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} {CHURCH.name}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
