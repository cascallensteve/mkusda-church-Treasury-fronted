'use client'

import { useState } from 'react'
import { ShieldCheck, Plus, Search, ArrowLeft, Loader2, CheckCircle2, Eye, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES, auditLogs as initialAudits } from '@/lib/data'

export default function AuditsPage() {
  const [audits, setAudits] = useState(initialAudits)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [formData, setFormData] = useState({
    user: '',
    action: '',
    amount: '',
  })

  const totalActions = audits.length
  const totalAmount = audits.reduce((sum, a) => sum + a.amount, 0)
  const uniqueUsers = Array.from(new Set(audits.map(a => a.user)))

  const filteredAudits = audits.filter(item => {
    const matchesSearch = item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = selectedUser === 'all' || item.user === selectedUser
    return matchesSearch && matchesUser
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
        time: new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }),
        user: formData.user,
        action: formData.action,
        amount: Number(formData.amount) || 0,
      }
      setAudits([newItem, ...audits])
      setFormData({ user: '', action: '', amount: '' })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Audits"
          description={`Review audit logs and tracked actions for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Add Audit Entry
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Actions" value={String(totalActions)} icon={ShieldCheck} accent="primary" />
          <StatCard label="Total Amount" value={formatKES(totalAmount, { compact: true })} icon={FileText} accent="emerald" />
          <StatCard label="Users" value={String(uniqueUsers.length)} icon={ShieldCheck} accent="teal" />
          <StatCard label="Avg Action" value={formatKES(Math.round(totalAmount / Math.max(totalActions, 1)), { compact: true })} icon={ShieldCheck} accent="amber" />
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
                  <h2 className="text-lg font-semibold">Add Audit Entry</h2>
                  <p className="text-sm text-muted-foreground">Enter the audit details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User *</Label>
                    <Input id="user" name="user" placeholder="e.g. A. Mushi (Treasurer)" value={formData.user} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input id="amount" name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="action">Action *</Label>
                    <Input id="action" name="action" placeholder="e.g. Approved expense EXP-2026-0312" value={formData.action} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Entry</>}
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
                  <CardTitle className="font-serif">Audit Log</CardTitle>
                  <CardDescription>
                    {filteredAudits.length} audit entries found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search audits..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="w-full sm:w-[220px]">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
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
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No audit entries found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudits.map((item, index) => (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell className="text-sm whitespace-nowrap">{item.time}</TableCell>
                          <TableCell className="font-medium">{item.user}</TableCell>
                          <TableCell className="text-sm">{item.action}</TableCell>
                          <TableCell className="text-right font-semibold">{item.amount > 0 ? formatKES(item.amount) : '—'}</TableCell>
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

        {/* View Audit Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Audit Entry Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedItem.action}</h3>
                    <p className="text-sm text-gray-500">{selectedItem.user}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span>{selectedItem.time}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold">{selectedItem.amount > 0 ? formatKES(selectedItem.amount) : '—'}</span></div>
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
