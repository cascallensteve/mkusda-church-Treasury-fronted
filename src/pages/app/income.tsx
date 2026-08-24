'use client'

import { useState } from 'react'
import { TrendingUp, Plus, Search, ArrowLeft, Loader2, CheckCircle2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES, income as initialIncome } from '@/lib/data'

export default function IncomePage() {
  const [income, setIncome] = useState(initialIncome)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFund, setSelectedFund] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [formData, setFormData] = useState({
    source: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'Cash',
    fund: 'General',
  })

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const funds = Array.from(new Set(income.map(i => i.fund)))

  const filteredIncome = income.filter(item => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFund = selectedFund === 'all' || item.fund === selectedFund
    return matchesSearch && matchesFund
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newItem = {
        id: `INC-2026-${String(income.length + 1).padStart(4, '0')}`,
        source: formData.source,
        date: formData.date,
        amount: Number(formData.amount) || 0,
        method: formData.method,
        fund: formData.fund,
      }
      setIncome([newItem, ...income])
      setFormData({ source: '', date: new Date().toISOString().split('T')[0], amount: '', method: 'Cash', fund: 'General' })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'Cash': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'M-Pesa': 'bg-blue-50 text-blue-700 border-blue-200',
      'Bank Transfer': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Mixed': 'bg-purple-50 text-purple-700 border-purple-200',
    }
    return colors[method] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Income"
          description={`Track all income sources and collections for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Add Income
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Income" value={formatKES(totalIncome, { compact: true })} icon={TrendingUp} accent="primary" />
          <StatCard label="Total Entries" value={String(income.length)} icon={TrendingUp} accent="emerald" />
          <StatCard label="Funds" value={String(funds.length)} icon={TrendingUp} accent="teal" />
          <StatCard label="Avg Entry" value={formatKES(Math.round(totalIncome / Math.max(income.length, 1)), { compact: true })} icon={TrendingUp} accent="amber" />
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
                  <h2 className="text-lg font-semibold">Add New Income</h2>
                  <p className="text-sm text-muted-foreground">Enter the income details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="source">Income Source *</Label>
                    <Input id="source" name="source" placeholder="e.g. Tithe Collection, Special Offering" value={formData.source} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input id="amount" name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleInputChange} required min="1" />
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
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fund">Fund *</Label>
                    <Select value={formData.fund} onValueChange={(value) => setFormData(prev => ({ ...prev, fund: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fund" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Tithe">Tithe</SelectItem>
                        <SelectItem value="Offering">Offering</SelectItem>
                        <SelectItem value="Building Fund">Building Fund</SelectItem>
                        <SelectItem value="Development Fund">Development Fund</SelectItem>
                        <SelectItem value="Mission Fund">Mission Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Income</>}
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
                  <CardTitle className="font-serif">Income Records</CardTitle>
                  <CardDescription>
                    {filteredIncome.length} income entries found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search income..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedFund} onValueChange={setSelectedFund}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by fund" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Funds</SelectItem>
                      {funds.map(fund => (
                        <SelectItem key={fund} value={fund}>{fund}</SelectItem>
                      ))}
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
                      <TableHead>Source</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncome.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No income records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncome.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-xs">{item.id}</TableCell>
                          <TableCell className="font-medium">{item.source}</TableCell>
                          <TableCell className="text-sm">{item.date}</TableCell>
                          <TableCell><Badge variant="secondary">{item.fund}</Badge></TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getMethodColor(item.method)}>{item.method}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">{formatKES(item.amount)}</TableCell>
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

        {/* View Income Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Income Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedItem.source}</h3>
                    <Badge variant="secondary" className={getMethodColor(selectedItem.method)}>{selectedItem.method}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-emerald-600">{formatKES(selectedItem.amount)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span>{selectedItem.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Fund</span><span>{selectedItem.fund}</span></div>
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
