'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HandCoins,
  Plus,
  Search,
  Download,
  Eye,
  Printer,
  ArrowLeft,
  Receipt,
  ChevronDown,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CHURCH, formatKES } from '@/lib/data'

const initialTithes = [
  {
    id: 1,
    memberName: 'John Mwangi',
    email: 'john@example.com',
    phone: '+254 712 345 678',
    amount: 15000,
    date: '2026-08-20',
    paymentMethod: 'M-Pesa',
    transactionId: 'MPESA-2026-0820-001',
    status: 'completed',
    notes: 'Tithe for August',
    receiptNumber: 'T-2026-0820-001'
  },
  {
    id: 2,
    memberName: 'Mary Wanjiru',
    email: 'mary@example.com',
    phone: '+254 723 456 789',
    amount: 8500,
    date: '2026-08-19',
    paymentMethod: 'Bank Transfer',
    transactionId: 'BT-2026-0819-002',
    status: 'completed',
    notes: 'Monthly tithe',
    receiptNumber: 'T-2026-0819-002'
  },
  {
    id: 3,
    memberName: 'Peter Ochieng',
    email: 'peter@example.com',
    phone: '+254 734 567 890',
    amount: 12000,
    date: '2026-08-18',
    paymentMethod: 'Cash',
    transactionId: 'CASH-2026-0818-003',
    status: 'pending',
    notes: 'Tithe for building fund',
    receiptNumber: 'T-2026-0818-003'
  },
  {
    id: 4,
    memberName: 'Sarah Akinyi',
    email: 'sarah@example.com',
    phone: '+254 745 678 901',
    amount: 6000,
    date: '2026-08-17',
    paymentMethod: 'M-Pesa',
    transactionId: 'MPESA-2026-0817-004',
    status: 'completed',
    notes: 'Thanksgiving tithe',
    receiptNumber: 'T-2026-0817-004'
  },
  {
    id: 5,
    memberName: 'David Kiprop',
    email: 'david@example.com',
    phone: '+254 756 789 012',
    amount: 20000,
    date: '2026-08-16',
    paymentMethod: 'Bank Transfer',
    transactionId: 'BT-2026-0816-005',
    status: 'failed',
    notes: 'Tithe for August (resubmitted)',
    receiptNumber: 'T-2026-0816-005'
  }
]

export default function TithePage() {
  const navigate = useNavigate()
  const [tithes, setTithes] = useState(initialTithes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTithe, setSelectedTithe] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSelectChange = (name: string, value: string) => {
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
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 1000)
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

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-emerald-500',
      pending: 'bg-amber-500',
      failed: 'bg-rose-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
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
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/dashboard')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <img
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Tithe Management</h1>
              <p className="text-xs text-gray-500">Record and track tithes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  Record Tithe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HandCoins className="w-5 h-5 text-indigo-600" />
                    Record New Tithe
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details of the tithe received. All fields marked with * are required.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Member Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="memberName"
                          name="memberName"
                          placeholder="John Doe"
                          value={formData.memberName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+254 712 345 678"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (KES) *</Label>
                      <div className="relative">
                        <HandCoins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          placeholder="10000"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                      >
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
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Additional notes about this tithe..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Record Tithe
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'list' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Total Tithes</p>
                  <p className="text-2xl font-bold text-indigo-700">{formatKES(totalTithes)}</p>
                  <p className="text-xs text-gray-500 mt-1">All recorded tithes</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatKES(totalCompleted)}</p>
                  <p className="text-xs text-gray-500 mt-1">{completedTithes.length} successful transactions</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">{tithes.filter(t => t.status === 'pending').length}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-0 shadow-sm"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-0 shadow-sm">
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

            {/* Tithe Table */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Tithe Records</CardTitle>
                    <CardDescription>
                      {filteredTithes.length} tithe{filteredTithes.length !== 1 ? 's' : ''} found
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold">Receipt #</TableHead>
                        <TableHead className="font-semibold">Member</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Date</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Method</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTithes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            <HandCoins className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            No tithes found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTithes.map((tithe) => (
                          <TableRow key={tithe.id} className="hover:bg-slate-50">
                            <TableCell className="font-mono text-xs">
                              {tithe.receiptNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 bg-indigo-100">
                                  <AvatarFallback className="text-xs text-indigo-600">
                                    {tithe.memberName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{tithe.memberName}</p>
                                  <p className="text-xs text-gray-400 hidden sm:block">{tithe.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatKES(tithe.amount)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">
                              {tithe.date}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {getPaymentMethodIcon(tithe.paymentMethod)} {tithe.paymentMethod}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(tithe.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(tithe)}
                                  className="h-8 w-8 p-0"
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
          </>
        ) : (
          /* Detail View */
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to List
                    </Button>
                    <div>
                      <CardTitle className="text-base font-semibold">Tithe Details</CardTitle>
                      <CardDescription>
                        Receipt #{selectedTithe?.receiptNumber}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {selectedTithe?.receiptNumber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedTithe && (
                  <>
                    {/* Member Info */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                      <Avatar className="h-14 w-14 bg-indigo-100">
                        <AvatarFallback className="text-lg text-indigo-600">
                          {selectedTithe.memberName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{selectedTithe.memberName}</h3>
                        <p className="text-sm text-gray-500">{selectedTithe.email}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {selectedTithe.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {selectedTithe.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">{formatKES(selectedTithe.amount)}</p>
                        <div className="mt-1">
                          {getStatusBadge(selectedTithe.status)}
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-0 bg-slate-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-500">Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="font-medium">{getPaymentMethodIcon(selectedTithe.paymentMethod)} {selectedTithe.paymentMethod}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono text-xs">{selectedTithe.transactionId}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Receipt Number</span>
                            <span className="font-mono text-xs">{selectedTithe.receiptNumber}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-slate-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-500">Status & Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            {getStatusBadge(selectedTithe.status)}
                          </div>
                          <Separator />
                          <div className="text-sm">
                            <span className="text-gray-500">Notes:</span>
                            <p className="text-gray-700 mt-1">{selectedTithe.notes || 'No notes'}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print Receipt
                      </Button>
                      <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Receipt className="w-4 h-4" />
                        View Receipt
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">{CHURCH.system} • {CHURCH.location}</p>
          <p className="text-xs text-gray-400 mt-1">© 2026 {CHURCH.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
