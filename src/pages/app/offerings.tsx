'use client'

import { useState } from 'react'
import {
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
  Loader2,
  DollarSign,
  Gift,
  Heart,
  Building2,
  Crown,
  Sparkles,
  Church
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

const initialOfferings = [
  { id: 1, memberName: 'Grace Muthoni', email: 'grace@example.com', phone: '+254 712 345 678', amount: 5000, offeringType: 'General Offering', date: '2026-08-20', paymentMethod: 'M-Pesa', transactionId: 'MPESA-2026-0820-001', status: 'completed', notes: 'Sunday morning offering', receiptNumber: 'O-2026-0820-001' },
  { id: 2, memberName: 'James Kariuki', email: 'james@example.com', phone: '+254 723 456 789', amount: 3000, offeringType: 'Thanksgiving', date: '2026-08-19', paymentMethod: 'Bank Transfer', transactionId: 'BT-2026-0819-002', status: 'completed', notes: 'Thanksgiving offering', receiptNumber: 'O-2026-0819-002' },
  { id: 3, memberName: 'Esther Wanjiku', email: 'esther@example.com', phone: '+254 734 567 890', amount: 2000, offeringType: 'Building Fund', date: '2026-08-18', paymentMethod: 'Cash', transactionId: 'CASH-2026-0818-003', status: 'pending', notes: 'Building fund contribution', receiptNumber: 'O-2026-0818-003' },
  { id: 4, memberName: 'Samuel Otieno', email: 'samuel@example.com', phone: '+254 745 678 901', amount: 7500, offeringType: 'Special Offering', date: '2026-08-17', paymentMethod: 'M-Pesa', transactionId: 'MPESA-2026-0817-004', status: 'completed', notes: 'Missions offering', receiptNumber: 'O-2026-0817-004' },
  { id: 5, memberName: 'Ruth Akinyi', email: 'ruth@example.com', phone: '+254 756 789 012', amount: 12000, offeringType: 'Seed Offering', date: '2026-08-16', paymentMethod: 'Bank Transfer', transactionId: 'BT-2026-0816-005', status: 'completed', notes: 'Seed faith offering', receiptNumber: 'O-2026-0816-005' },
  { id: 6, memberName: 'Daniel Mwangi', email: 'daniel@example.com', phone: '+254 767 890 123', amount: 4000, offeringType: 'General Offering', date: '2026-08-15', paymentMethod: 'Card', transactionId: 'CARD-2026-0815-006', status: 'failed', notes: 'Card payment declined', receiptNumber: 'O-2026-0815-006' }
]

const offeringTypes = [
  { value: 'General Offering', icon: Gift, color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 'Thanksgiving', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
  { value: 'Building Fund', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-100' },
  { value: 'Special Offering', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100' },
  { value: 'Seed Offering', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { value: 'Missions', icon: Church, color: 'text-indigo-600', bg: 'bg-indigo-100' }
]

const paymentMethods = ['M-Pesa', 'Bank Transfer', 'Cash', 'Card']

export default function OfferingPage() {
  const [offerings, setOfferings] = useState(initialOfferings)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [selectedOffering, setSelectedOffering] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    memberName: '',
    email: '',
    phone: '',
    amount: '',
    offeringType: 'General Offering',
    paymentMethod: 'M-Pesa',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const totalOfferings = offerings.reduce((sum, o) => sum + o.amount, 0)
  const completedOfferings = offerings.filter(o => o.status === 'completed')
  const totalCompleted = completedOfferings.reduce((sum, o) => sum + o.amount, 0)
  const pendingOfferings = offerings.filter(o => o.status === 'pending')
  const totalPending = pendingOfferings.reduce((sum, o) => sum + o.amount, 0)

  const typeBreakdown = offeringTypes.map(type => {
    const items = offerings.filter(o => o.offeringType === type.value && o.status === 'completed')
    return { ...type, count: items.length, total: items.reduce((sum, o) => sum + o.amount, 0) }
  }).filter(t => t.count > 0)

  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = offering.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offering.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offering.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || offering.offeringType === selectedType
    const matchesStatus = selectedStatus === 'all' || offering.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newOffering = {
        id: offerings.length + 1,
        memberName: formData.memberName,
        email: formData.email,
        phone: formData.phone || 'N/A',
        amount: parseFloat(formData.amount),
        offeringType: formData.offeringType,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        status: 'completed',
        notes: formData.notes || 'Offering recorded',
        receiptNumber: `O-${formData.date.replace(/-/g, '')}-${String(offerings.length + 1).padStart(3, '0')}`
      }
      setOfferings([newOffering, ...offerings])
      setFormData({
        memberName: '',
        email: '',
        phone: '',
        amount: '',
        offeringType: 'General Offering',
        paymentMethod: 'M-Pesa',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleViewReceipt = (offering: any) => {
    setSelectedOffering(offering)
    setIsReceiptDialogOpen(true)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      failed: 'bg-rose-100 text-rose-700 border-rose-200'
    }
    return <Badge className={`${styles[status as keyof typeof styles]} px-3 py-1 text-xs font-medium`}>{status}</Badge>
  }

  const getOfferingTypeBadge = (type: string) => {
    const found = offeringTypes.find(t => t.value === type)
    if (!found) return <Badge variant="outline">{type}</Badge>
    return (
      <Badge className={`${found.bg} ${found.color} border-0 px-3 py-1 text-xs font-medium`}>
        {type}
      </Badge>
    )
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
          title="Offerings"
          description={`Track and manage all offerings for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Record Offering
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Offerings" value={formatKES(totalOfferings, { compact: true })} icon={Gift} accent="primary" />
          <StatCard label="Completed" value={formatKES(totalCompleted, { compact: true })} icon={CheckCircle2} accent="emerald" />
          <StatCard label="Pending" value={formatKES(totalPending, { compact: true })} icon={Calendar} accent="amber" />
          <StatCard label="Active Types" value={`${typeBreakdown.length} types`} icon={DollarSign} accent="teal" />
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
                  <h2 className="text-lg font-semibold">Record New Offering</h2>
                  <p className="text-sm text-muted-foreground">Enter the offering details below.</p>
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
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="amount" name="amount" type="number" placeholder="10000" value={formData.amount} onChange={handleInputChange} className="pl-10" required min="1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offeringType">Offering Type *</Label>
                    <Select value={formData.offeringType} onValueChange={(value) => handleSelectChange('offeringType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offering type" />
                      </SelectTrigger>
                      <SelectContent>
                        {offeringTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.value}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
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
                    <Textarea id="notes" name="notes" placeholder="Additional notes about this offering..." value={formData.notes} onChange={handleInputChange} rows={3} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recording...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Record Offering</>}
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
                  <CardTitle className="font-serif">Offering Records</CardTitle>
                  <CardDescription>
                    {filteredOfferings.length} offering{filteredOfferings.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search offerings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Offering Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {offeringTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
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
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOfferings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          No offerings found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOfferings.map((offering) => (
                        <TableRow key={offering.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-xs text-gray-500">
                            {offering.receiptNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 bg-indigo-100">
                                <AvatarFallback className="text-xs font-medium text-indigo-600">
                                  {offering.memberName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm text-gray-800">{offering.memberName}</p>
                                <p className="text-xs text-gray-400 hidden sm:block">{offering.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-gray-800">
                            {formatKES(offering.amount)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getOfferingTypeBadge(offering.offeringType)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                            {offering.date}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm text-gray-600">
                              {getPaymentMethodIcon(offering.paymentMethod)} {offering.paymentMethod}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(offering.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewReceipt(offering)}
                                className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50"
                              >
                                <Receipt className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
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
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedOffering && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span className="text-xl font-bold">Offering Receipt</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedOffering.receiptNumber}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4" id="receipt-content">
                  <div className="text-center border-b pb-4">
                    <img
                      src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
                      alt="Logo"
                      className="h-16 w-16 mx-auto mb-2"
                    />
                    <h3 className="font-bold text-lg text-gray-800">{CHURCH.name}</h3>
                    <p className="text-xs text-gray-500">{CHURCH.location}</p>
                    <p className="text-xs text-gray-500">{CHURCH.system}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Receipt Number</span>
                      <span className="font-mono font-medium text-gray-800">{selectedOffering.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-800">{selectedOffering.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Member</span>
                      <span className="font-medium text-gray-800">{selectedOffering.memberName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="text-gray-800">{selectedOffering.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-800">{selectedOffering.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="text-gray-800">{selectedOffering.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-mono text-xs text-gray-600">{selectedOffering.transactionId}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Amount</span>
                    <span className="text-purple-600">{formatKES(selectedOffering.amount)}</span>
                  </div>

                  {selectedOffering.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500 block mb-1">Notes:</span>
                      <p className="text-sm text-gray-700">{selectedOffering.notes}</p>
                    </div>
                  )}

                  <div className="text-center text-xs text-gray-400 border-t pt-4">
                    <p className="text-gray-600">Thank you for your generous giving</p>
                    <p className="text-gray-400">This is a computer-generated receipt</p>
                    <p className="text-gray-400 mt-1">© {new Date().getFullYear()} {CHURCH.name}</p>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handlePrintReceipt} className="gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button onClick={() => setIsReceiptDialogOpen(false)} className="bg-indigo-600 hover:bg-indigo-700">
                    Close
                  </Button>
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
