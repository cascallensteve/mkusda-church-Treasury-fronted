'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Download, 
  Eye,
  Printer,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Receipt,
  Church,
  Gift,
  Heart,
  DollarSign,
  Building2,
  BarChart3,
  Clock,
  Sparkles,
  Crown
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

import { CHURCH, formatKES } from '@/lib/data'

// Sample offering data
const initialOfferings = [
  {
    id: 1,
    memberName: 'Grace Muthoni',
    email: 'grace@example.com',
    phone: '+254 712 345 678',
    amount: 5000,
    offeringType: 'General Offering',
    date: '2026-08-20',
    paymentMethod: 'M-Pesa',
    transactionId: 'MPESA-2026-0820-001',
    status: 'completed',
    notes: 'Sunday morning offering',
    receiptNumber: 'O-2026-0820-001'
  },
  {
    id: 2,
    memberName: 'James Kariuki',
    email: 'james@example.com',
    phone: '+254 723 456 789',
    amount: 3000,
    offeringType: 'Thanksgiving',
    date: '2026-08-19',
    paymentMethod: 'Bank Transfer',
    transactionId: 'BT-2026-0819-002',
    status: 'completed',
    notes: 'Thanksgiving offering',
    receiptNumber: 'O-2026-0819-002'
  },
  {
    id: 3,
    memberName: 'Esther Wanjiku',
    email: 'esther@example.com',
    phone: '+254 734 567 890',
    amount: 2000,
    offeringType: 'Building Fund',
    date: '2026-08-18',
    paymentMethod: 'Cash',
    transactionId: 'CASH-2026-0818-003',
    status: 'pending',
    notes: 'Building fund contribution',
    receiptNumber: 'O-2026-0818-003'
  },
  {
    id: 4,
    memberName: 'Samuel Otieno',
    email: 'samuel@example.com',
    phone: '+254 745 678 901',
    amount: 7500,
    offeringType: 'Special Offering',
    date: '2026-08-17',
    paymentMethod: 'M-Pesa',
    transactionId: 'MPESA-2026-0817-004',
    status: 'completed',
    notes: 'Missions offering',
    receiptNumber: 'O-2026-0817-004'
  },
  {
    id: 5,
    memberName: 'Ruth Akinyi',
    email: 'ruth@example.com',
    phone: '+254 756 789 012',
    amount: 12000,
    offeringType: 'Seed Offering',
    date: '2026-08-16',
    paymentMethod: 'Bank Transfer',
    transactionId: 'BT-2026-0816-005',
    status: 'completed',
    notes: 'Seed faith offering',
    receiptNumber: 'O-2026-0816-005'
  },
  {
    id: 6,
    memberName: 'Daniel Mwangi',
    email: 'daniel@example.com',
    phone: '+254 767 890 123',
    amount: 4000,
    offeringType: 'General Offering',
    date: '2026-08-15',
    paymentMethod: 'Card',
    transactionId: 'CARD-2026-0815-006',
    status: 'failed',
    notes: 'Card payment declined',
    receiptNumber: 'O-2026-0815-006'
  }
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
  const navigate = useNavigate()
  const [offerings, setOfferings] = useState(initialOfferings)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [selectedOffering, setSelectedOffering] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
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

  // Calculate statistics
  const totalOfferings = offerings.reduce((sum, o) => sum + o.amount, 0)
  const completedOfferings = offerings.filter(o => o.status === 'completed')
  const totalCompleted = completedOfferings.reduce((sum, o) => sum + o.amount, 0)
  const pendingOfferings = offerings.filter(o => o.status === 'pending')
  const totalPending = pendingOfferings.reduce((sum, o) => sum + o.amount, 0)
  
  // Offering type breakdown
  const typeBreakdown = offeringTypes.map(type => {
    const items = offerings.filter(o => o.offeringType === type.value && o.status === 'completed')
    return {
      ...type,
      count: items.length,
      total: items.reduce((sum, o) => sum + o.amount, 0)
    }
  }).filter(t => t.count > 0)

  // Filter offerings
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
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 1000)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/dashboard')} className="gap-2 hover:bg-indigo-50">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <img
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Offering Management</h1>
              <p className="text-xs text-gray-500">Track and manage all offerings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  Record Offering
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <Gift className="w-6 h-6 text-purple-600" />
                    Record New Offering
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details of the offering received. All fields marked with * are required.
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
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      <Label htmlFor="offeringType">Offering Type *</Label>
                      <Select
                        value={formData.offeringType}
                        onValueChange={(value) => handleSelectChange('offeringType', value)}
                      >
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
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                      >
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
                        placeholder="Additional notes about this offering..."
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
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Record Offering
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Offerings</p>
                  <p className="text-2xl font-bold text-purple-700">{formatKES(totalOfferings)}</p>
                  <p className="text-xs text-purple-500 mt-1">All recorded offerings</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatKES(totalCompleted)}</p>
                  <p className="text-xs text-emerald-500 mt-1">{completedOfferings.length} successful</p>
                </div>
                <div className="p-3 bg-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">{formatKES(totalPending)}</p>
                  <p className="text-xs text-amber-500 mt-1">{pendingOfferings.length} awaiting</p>
                </div>
                <div className="p-3 bg-amber-200 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Offering Types</p>
                  <p className="text-2xl font-bold text-indigo-700">{offeringTypes.filter(t => offerings.some(o => o.offeringType === t.value && o.status === 'completed')).length}</p>
                  <p className="text-xs text-indigo-500 mt-1">Active categories</p>
                </div>
                <div className="p-3 bg-indigo-200 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Type Breakdown */}
        {typeBreakdown.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
            {typeBreakdown.map((type) => (
              <Card key={type.value} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedType(type.value)}>
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-xl ${type.bg} flex items-center justify-center mx-auto mb-2`}>
                    <type.icon className={`w-5 h-5 ${type.color}`} />
                  </div>
                  <p className="text-xs text-gray-500">{type.value}</p>
                  <p className="text-sm font-bold text-gray-800">{formatKES(type.total, { compact: true })}</p>
                  <p className="text-xs text-gray-400">{type.count} entries</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[160px] bg-white border-0 shadow-sm">
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
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-0 shadow-sm">
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

        {/* Offering Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Offering Records</CardTitle>
                <CardDescription>
                  {filteredOfferings.length} offering{filteredOfferings.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-purple-200 hover:bg-purple-50">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-600">Receipt #</TableHead>
                    <TableHead className="font-semibold text-gray-600">Member</TableHead>
                    <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Type</TableHead>
                    <TableHead className="font-semibold text-gray-600 hidden sm:table-cell">Date</TableHead>
                    <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">Method</TableHead>
                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOfferings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Gift className="w-10 h-10 text-purple-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No offerings found</p>
                          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOfferings.map((offering) => (
                      <TableRow key={offering.id} className="hover:bg-purple-50/50 transition-colors">
                        <TableCell className="font-mono text-xs text-gray-500">
                          {offering.receiptNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-100 to-pink-100">
                              <AvatarFallback className="text-xs font-medium text-purple-600">
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
                              className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50"
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
      </main>

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

                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Offering Type</span>
                    {getOfferingTypeBadge(selectedOffering.offeringType)}
                  </div>
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
                <Button onClick={() => setIsReceiptDialogOpen(false)} className="bg-purple-600 hover:bg-purple-700">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">{CHURCH.system} • {CHURCH.location}</p>
          <p className="text-xs text-gray-400 mt-1">© 2026 {CHURCH.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}