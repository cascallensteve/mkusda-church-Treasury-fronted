'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { PageHeader } from '@/components/page-header'
import { api } from '@/lib/api'
import { formatKES } from '@/lib/data'

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
  PENDING: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  SUCCESS: { label: 'Success', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200' },
}

export default function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)

  const fetchTransaction = async (transactionId: number) => {
    setIsLoading(true)
    try {
      const data = await api.getTransaction(transactionId)
      setTransaction(data)
    } catch (err: any) {
      console.error('Failed to load transaction:', err)
      toast.error(err?.body?.detail || err?.message || 'Failed to load transaction details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const transactionId = parseInt(id || '')
    if (transactionId) {
      fetchTransaction(transactionId)
    } else {
      setIsLoading(false)
    }
  }, [id])

  const handleResendReceipt = async () => {
    if (!transaction) return
    setIsResending(true)
    try {
      const response = await api.resendReceipt(transaction.id)
      toast.success(`Receipt resent successfully to ${response.email}`)
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Failed to resend receipt')
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Transaction Details"
          description="Loading transaction information..."
          actions={
            <Button variant="outline" onClick={() => navigate('/app/transactions')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Transaction Details"
          description="Transaction not found"
          actions={
            <Button variant="outline" onClick={() => navigate('/app/transactions')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p className="text-lg font-medium">Transaction not found</p>
            <p className="text-sm">The requested transaction does not exist or you do not have permission to view it.</p>
            <Button className="mt-4" onClick={() => navigate('/app/transactions')}>
              Return to Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[transaction.status] || STATUS_CONFIG.PENDING

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Details"
        description={`Transaction #${transaction.id} details and receipt options`}
        actions={
          <Button variant="outline" onClick={() => navigate('/app/transactions')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Transaction #{transaction.id}</CardTitle>
              <CardDescription>{transaction.donation_type_name}</CardDescription>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Donor Name</p>
                <p className="text-sm font-medium">{transaction.donor_name || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Donor Email</p>
                <p className="text-sm font-medium">{transaction.donor_email || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium">{transaction.phone_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-bold text-lg">{formatKES(Number(transaction.amount))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">M-Pesa Receipt</p>
                <p className="text-sm font-medium">{transaction.mpesa_receipt || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm">{new Date(transaction.created_at).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="text-sm">{new Date(transaction.updated_at).toLocaleString()}</p>
              </div>
            </div>

            {transaction.transaction_desc && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm">{transaction.transaction_desc}</p>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/app/transactions')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Transactions
              </Button>
              <Button
                onClick={handleResendReceipt}
                disabled={isResending || !transaction.donor_email}
                className="gap-2"
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Resending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Resend Receipt
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
