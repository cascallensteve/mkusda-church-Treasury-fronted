'use client'

import { useState } from 'react'
import {
  HandCoins,
  Plus,
  Search,
  Eye,
  Printer,
  ArrowLeft,
  Receipt,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES } from '@/lib/data'

const initialTithes = [
  { id: 1, memberName: 'John Mwangi', email: 'john@example.com', phone: '+254 712 345 678', amount: 15000, date: '2026-08-20', paymentMethod: 'M-Pesa', transactionId: 'MPESA-2026-0820-001', status: 'completed', notes: 'Tithe for August', receiptNumber: 'T-2026-0820-001' },
  { id: 2, memberName: 'Mary Wanjiru', email: 'mary@example.com', phone: '+254 723 456 789', amount: 8500, date: '2026-08-19', paymentMethod: 'Bank Transfer', transactionId: 'BT-2026-0819-002', status: 'completed', notes: 'Monthly tithe', receiptNumber: 'T-2026-0819-002' },
  { id: 3, memberName: 'Peter Ochieng', email: 'peter@example.com', phone: '+254 734 567 890', amount: 12000, date: '2026-08-18', paymentMethod: 'Cash', transactionId: 'CASH-2026-0818-003', status: 'pending', notes: 'Tithe for building fund', receiptNumber: 'T-2026-0818-003' },
  { id: 4, memberName: 'Sarah Akinyi', email: 'sarah@example.com', phone: '+254 745 678 901', amount: 6000, date: '2026-08-17', paymentMethod: 'M-Pesa', transactionId: 'MPESA-2026-0817-004', status: 'completed', notes: 'Thanksgiving tithe', receiptNumber: 'T-2026-0817-004' },
  { id: 5, memberName: 'David Kiprop', email: 'david@example.com', phone: '+254 756 789 012', amount: 20000, date: '2026-08-16', paymentMethod: 'Bank Transfer', transactionId: 'BT-2026-0816-005', status: 'failed', notes: 'Tithe for August (resubmitted)', receiptNumber: 'T-2026-0816-005' }
]

export default function TithePage() {
  const [tithes, setTithes] = useState(initialTithes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTithe, setSelectedTithe] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [isLoading, setIsLoading] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  const [formData, setFormData] = useState({
    memberName: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: 'M-Pesa',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const totalTithes = tithes.reduce((sum, t) => sum + t.amount, 0)
  const completedTithes = tithes.filter(t => t.status === 'completed')
  const totalCompleted = completedTithes.reduce((sum, t) => sum + t.amount, 0)
  const pendingCount = tithes.filter(t => t.status === 'pending').length

  const filteredTithes = tithes.filter(tithe => {
    const matchesSearch = tithe.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tithe.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tithe.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || tithe.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newTithe = {
        id: tithes.length + 1,
        memberName: formData.memberName,
        email: formData.email,
        phone: formData.phone || 'N/A',
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        status: 'completed',
        notes: formData.notes || 'Tithe recorded',
        receiptNumber: `T-${formData.date.replace(/-/g, '')}-${String(tithes.length + 1).padStart(3, '0')}`
      }
      setTithes([newTithe, ...tithes])
      setFormData({
        memberName: '',
        email: '',
        phone: '',
        amount: '',
        paymentMethod: 'M-Pesa',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleViewDetail = (tithe: any) => {
    setSelectedTithe(tithe)
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTithe(null)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      failed: 'bg-rose-100 text-rose-700 border-rose-200'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      'M-Pesa': '📱',
      'Bank Transfer': '🏦',
      'Cash': '💵',
      'Card': '💳'
    }
    return icons[method] || '💳'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Tithes"
          description={`Record and track tithes for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Record Tithe
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Tithes" value={formatKES(totalTithes, { compact: true })} icon={HandCoins} accent="primary" />
          <StatCard label="Completed" value={formatKES(totalCompleted, { compact: true })} icon={CheckCircle2} accent="emerald" />
          <StatCard label="Pending" value={`${pendingCount} entries`} icon={Calendar} accent="amber" />
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
                  <h2 className="text-lg font-semibold">Record New Tithe</h2>
                  <p className="text-sm text-muted-foreground">Enter the tithe details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Member Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="memberName" name="memberName" placeholder="John Doe" value={formData.memberName} onChange={handleInputChange} className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="phone" name="phone" placeholder="+254 712 345 678" value={formData.phone} onChange={handleInputChange} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <div className="relative">
                      <HandCoins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="amount" name="amount" type="number" placeholder="10000" value={formData.amount} onChange={handleInputChange} className="pl-10" required min="1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M-Pesa">📱 M-Pesa</SelectItem>
                        <SelectItem value="Bank Transfer">🏦 Bank Transfer</SelectItem>
                        <SelectItem value="Cash">💵 Cash</SelectItem>
                        <SelectItem value="Card">💳 Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="pl-10" required />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" placeholder="Additional notes about this tithe..." value={formData.notes} onChange={handleInputChange} rows={3} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recording...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Record Tithe</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : viewMode === 'detail' && selectedTithe ? (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={handleBackToList} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                  </Button>
                  <div>
                    <CardTitle className="text-base font-semibold">Tithe Details</CardTitle>
                    <CardDescription>Receipt #{selectedTithe.receiptNumber}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">{selectedTithe.receiptNumber}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTithe && (
                <>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                    <Avatar className="h-14 w-14 bg-indigo-100">
                      <AvatarFallback className="text-lg text-indigo-600">
                        {selectedTithe.memberName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{selectedTithe.memberName}</h3>
                      <p className="text-sm text-gray-500">{selectedTithe.email}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedTithe.phone}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedTithe.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{formatKES(selectedTithe.amount)}</p>
                      <div className="mt-1">{getStatusBadge(selectedTithe.status)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-0 bg-slate-50">
                      <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-500">Payment Information</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Method</span><span className="font-medium">{getPaymentMethodIcon(selectedTithe.paymentMethod)} {selectedTithe.paymentMethod}</span></div>
                        <Separator />
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-xs">{selectedTithe.transactionId}</span></div>
                        <Separator />
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Receipt Number</span><span className="font-mono text-xs">{selectedTithe.receiptNumber}</span></div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-slate-50">
                      <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-500">Status & Notes</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span>{getStatusBadge(selectedTithe.status)}</div>
                        <Separator />
                        <div className="text-sm"><span className="text-gray-500">Notes:</span><p className="text-gray-700 mt-1">{selectedTithe.notes || 'No notes'}</p></div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="w-4 h-4" />Print Receipt</Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsReceiptOpen(true)}><Receipt className="w-4 h-4" />View Receipt</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif">Tithe Records</CardTitle>
                  <CardDescription>{filteredTithes.length} tithe{filteredTithes.length !== 1 ? 's' : ''} found</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search tithes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTithes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No tithes found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTithes.map((tithe) => (
                        <TableRow key={tithe.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-xs">{tithe.receiptNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 bg-indigo-100">
                                <AvatarFallback className="text-xs text-indigo-600">{tithe.memberName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{tithe.memberName}</p>
                                <p className="text-xs text-gray-400 hidden sm:block">{tithe.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatKES(tithe.amount)}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{tithe.date}</TableCell>
                          <TableCell className="hidden md:table-cell"><span className="text-sm">{getPaymentMethodIcon(tithe.paymentMethod)} {tithe.paymentMethod}</span></TableCell>
                          <TableCell>{getStatusBadge(tithe.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetail(tithe)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
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

        {/* Receipt Dialog */}
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="max-w-md">
            {selectedTithe && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span className="text-xl font-bold">Tithe Receipt</span>
                    <Badge variant="outline" className="font-mono text-xs">{selectedTithe.receiptNumber}</Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="text-center border-b pb-4">
                    <img src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png" alt="Logo" className="h-16 w-16 mx-auto mb-2" />
                    <h3 className="font-bold text-lg text-gray-800">{CHURCH.name}</h3>
                    <p className="text-xs text-gray-500">{CHURCH.location}</p>
                    <p className="text-xs text-gray-500">{CHURCH.system}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Receipt Number</span><span className="font-mono font-medium text-gray-800">{selectedTithe.receiptNumber}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="text-gray-800">{selectedTithe.date}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Member</span><span className="font-medium text-gray-800">{selectedTithe.memberName}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="text-gray-800">{selectedTithe.email}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Phone</span><span className="text-gray-800">{selectedTithe.phone}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Method</span><span className="text-gray-800">{selectedTithe.paymentMethod}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-xs text-gray-600">{selectedTithe.transactionId}</span></div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold"><span className="text-gray-800">Amount</span><span className="text-indigo-600">{formatKES(selectedTithe.amount)}</span></div>
                  {selectedTithe.notes && (<div className="bg-gray-50 rounded-lg p-3"><span className="text-xs text-gray-500 block mb-1">Notes:</span><p className="text-sm text-gray-700">{selectedTithe.notes}</p></div>)}
                  <div className="text-center text-xs text-gray-400 border-t pt-4">
                    <p className="text-gray-600">Thank you for your generous giving</p>
                    <p className="text-gray-400">This is a computer-generated receipt</p>
                    <p className="text-gray-400 mt-1">© {new Date().getFullYear()} {CHURCH.name}</p>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="w-4 h-4" />Print</Button>
                  <Button onClick={() => setIsReceiptOpen(false)} className="bg-indigo-600 hover:bg-indigo-700">Close</Button>
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
