'use client'

import { useState } from 'react'
import { Building2, TrendingUp, TrendingDown, Wallet, Search, Users, Loader2, CheckCircle2, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES, departments as initialDepartments } from '@/lib/data'

type Department = {
  name: string
  budget: number
  income: number
  expenses: number
  leader: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    budget: '',
    income: '',
    expenses: '',
  })

  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0)
  const totalIncome = departments.reduce((sum, d) => sum + d.income, 0)
  const totalExpenses = departments.reduce((sum, d) => sum + d.expenses, 0)

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const budgetStatus = dept.expenses > dept.budget ? 'over' : dept.expenses > dept.budget * 0.8 ? 'near' : 'good'
    const matchesStatus = selectedStatus === 'all' || budgetStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getBudgetStatus = (dept: Department) => {
    if (dept.expenses > dept.budget) return { label: 'Over Budget', color: 'bg-rose-50 text-rose-700 border-rose-200' }
    if (dept.expenses > dept.budget * 0.8) return { label: 'Near Limit', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { label: 'On Track', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  }

  const getProgressColor = (dept: Department) => {
    const ratio = dept.expenses / dept.budget
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
      const newDept: Department = {
        name: formData.name,
        leader: formData.leader,
        budget: Number(formData.budget) || 0,
        income: Number(formData.income) || 0,
        expenses: Number(formData.expenses) || 0,
      }
      setDepartments([...departments, newDept])
      setFormData({ name: '', leader: '', budget: '', income: '', expenses: '' })
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept)
    setFormData({
      name: dept.name,
      leader: dept.leader,
      budget: String(dept.budget),
      income: String(dept.income),
      expenses: String(dept.expenses),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDept) return
    setIsLoading(true)

    setTimeout(() => {
      setDepartments(departments.map(d =>
        d.name === selectedDept.name ? {
          ...d,
          name: formData.name,
          leader: formData.leader,
          budget: Number(formData.budget) || 0,
          income: Number(formData.income) || 0,
          expenses: Number(formData.expenses) || 0,
        } : d
      ))
      setIsEditDialogOpen(false)
      setIsLoading(false)
      setSelectedDept(null)
      setFormData({ name: '', leader: '', budget: '', income: '', expenses: '' })
    }, 800)
  }

  const handleDelete = (dept: Department) => {
    if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
      setDepartments(departments.filter(d => d.name !== dept.name))
    }
  }

  const handleView = (dept: Department) => {
    setSelectedDept(dept)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Departments"
          description={`Financial overview and budget tracking by department for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Building2 className="w-4 h-4" />
              Add Department
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Budget" value={formatKES(totalBudget, { compact: true })} icon={Wallet} accent="primary" />
          <StatCard label="Total Income" value={formatKES(totalIncome, { compact: true })} icon={TrendingUp} accent="emerald" />
          <StatCard label="Total Expenses" value={formatKES(totalExpenses, { compact: true })} icon={TrendingDown} accent="amber" />
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
                  <h2 className="text-lg font-semibold">Add New Department</h2>
                  <p className="text-sm text-muted-foreground">Enter the department details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leader">Leader *</Label>
                    <Input id="leader" name="leader" value={formData.leader} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (KES) *</Label>
                    <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">Income (KES)</Label>
                    <Input id="income" name="income" type="number" value={formData.income} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Expenses (KES)</Label>
                    <Input id="expenses" name="expenses" type="number" value={formData.expenses} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Add Department</>}
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
                  <CardTitle className="font-serif">Department List</CardTitle>
                  <CardDescription>
                    {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
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
                      <TableHead>Department</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No departments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((dept, index) => {
                        const status = getBudgetStatus(dept)
                        const progress = Math.min((dept.expenses / dept.budget) * 100, 100)
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{dept.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{dept.leader}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">{formatKES(dept.budget)}</TableCell>
                            <TableCell className="text-sm text-emerald-600 font-medium">{formatKES(dept.income)}</TableCell>
                            <TableCell className="text-sm text-rose-600 font-medium">{formatKES(dept.expenses)}</TableCell>
                            <TableCell>
                              <div className="w-full">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                  <div className={`h-full rounded-full ${getProgressColor(dept)}`} style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary" className={status.color}>{status.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(dept)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(dept)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
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

        {/* View Department Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedDept && (
              <>
                <DialogHeader>
                  <DialogTitle>Department Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedDept.name}</h3>
                      <p className="text-sm text-muted-foreground">Led by {selectedDept.leader}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Budget</span><span className="font-medium">{formatKES(selectedDept.budget)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Income</span><span className="font-medium text-emerald-600">{formatKES(selectedDept.income)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expenses</span><span className="font-medium text-rose-600">{formatKES(selectedDept.expenses)}</span></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>Update the department details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Department Name *</Label>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-leader">Leader *</Label>
                  <Input id="edit-leader" name="leader" value={formData.leader} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget (KES) *</Label>
                  <Input id="edit-budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-income">Income (KES)</Label>
                  <Input id="edit-income" name="income" type="number" value={formData.income} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expenses">Expenses (KES)</Label>
                  <Input id="edit-expenses" name="expenses" type="number" value={formData.expenses} onChange={handleInputChange} />
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
