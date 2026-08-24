'use client'

import { useState } from 'react'
import { Receipt, Plus, Search, ArrowLeft, Loader2, CheckCircle2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES, expenses as initialExpenses, expenseCategories } from '@/lib/data'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [formData, setFormData] = useState({
    category: 'Utilities',
    description: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'Cash',
    status: 'Pending',
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'Pending')
  const pendingTotal = pendingExpenses.reduce((sum, e) => sum + e.amount, 0)
  const approvedTotal = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0)

  const filteredExpenses = expenses.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newItem = {
        id: `EXP-2026-${String(expenses.length + 1).padStart(4, '0')}`,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        amount: Number(formData.amount) || 0,
        status: formData.status,
        method: formData.method,
      }
      setExpenses([newItem, ...expenses])
      setFormData({ category: 'Utilities', description: '', date: new Date().toISOString().split('T')[0], amount: '', method: 'Cash', status: 'Pending' })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
    }
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Expenses"
          description={`Track and manage all church expenses for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Expenses" value={formatKES(totalExpenses, { compact: true })} icon={Receipt} accent="primary" />
          <StatCard label="Approved" value={formatKES(approvedTotal, { compact: true })} icon={CheckCircle2} accent="emerald" />
          <StatCard label="Pending" value={`${pendingExpenses.length} items`} icon={Receipt} accent="amber" />
          <StatCard label="Pending Amount" value={formatKES(pendingTotal, { compact: true })} icon={Receipt} accent="teal" />
        </div>

        {isFormOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsFormOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Add New Expense</h2>
                  <p className="text-sm text-muted-foreground">Enter the expense details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input id="amount" name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleInputChange} required min="1" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input id="description" name="description" placeholder="Expense description" value={formData.description} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method *</Label>
                    <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Expense</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif">Expense Records</CardTitle>
                  <CardDescription>
                    {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search expenses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No expenses found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-xs">{item.id}</TableCell>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="text-sm">{item.description}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{item.date}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(item.status)}>{item.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-rose-600">{formatKES(item.amount)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleView(item)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Expense Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Expense Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedItem.description}</h3>
                    <Badge variant="secondary" className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Category</span><span>{selectedItem.category}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-rose-600">{formatKES(selectedItem.amount)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span>{selectedItem.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Method</span><span>{selectedItem.method}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Reference</span><span className="font-mono text-xs">{selectedItem.id}</span></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
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
