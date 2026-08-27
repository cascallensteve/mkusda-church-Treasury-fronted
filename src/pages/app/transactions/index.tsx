'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Search, Loader2, CheckCircle2, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

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

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { api } from '@/lib/api'
import { CHURCH, formatKES } from '@/lib/data'

type Transaction = {
  id: number
  donation_type: number
  donation_type_name: string
  user: number | null
  user_email: string | null
  phone_number: string
  amount: string
  donor_name: string
  donor_email: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  mpesa_receipt: string | null
  merchant_request_id: string | null
  checkout_request_id: string | null
  transaction_desc: string
  created_at: string
  updated_at: string
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  SUCCESS: { label: 'Success', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  FAILED: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle },
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const data = await api.getTransactions()
      setTransactions(data.results || data)
    } catch (err: any) {
      console.error('Failed to load transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      (tx.donor_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.donor_email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.phone_number.includes(searchTerm) ||
      (tx.donation_type_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tx.id).includes(searchTerm)
    const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0)
  const pendingCount = transactions.filter(tx => tx.status === 'PENDING').length
  const failedCount = transactions.filter(tx => tx.status === 'FAILED' || tx.status === 'CANCELLED').length

  const handleView = (tx: Transaction) => {
    navigate(`/app/transactions/${tx.id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={`View and track all donation transactions for ${CHURCH.name}`}
        actions={
          <Button onClick={fetchTransactions} variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Transactions" value={String(transactions.length)} icon={Eye} accent="primary" />
        <StatCard label="Total Amount" value={formatKES(totalAmount, { compact: true })} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Pending" value={String(pendingCount)} icon={Clock} accent="amber" />
        <StatCard label="Failed/Cancelled" value={String(failedCount)} icon={XCircle} accent="emerald" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">All Transactions</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchTerm || selectedStatus !== 'all' ? 'No transactions match your filters.' : 'No transactions found.'}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((tx) => {
                      const statusConfig = STATUS_CONFIG[tx.status] || STATUS_CONFIG.PENDING
                      const StatusIcon = statusConfig.icon
                      return (
                        <TableRow key={tx.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">#{tx.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{tx.donor_name}</span>
                              <span className="text-xs text-gray-500">{tx.donor_email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{tx.donation_type_name}</TableCell>
                          <TableCell className="font-semibold">{formatKES(Number(tx.amount))}</TableCell>
                          <TableCell className="text-sm">{tx.phone_number}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(tx)}
                                className="h-8 w-8 text-gray-600 hover:text-indigo-600"
                                title="View transaction details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
