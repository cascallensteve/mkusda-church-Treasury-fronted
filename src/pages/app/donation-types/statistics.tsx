'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, HandCoins, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { DonationStatisticsChart } from '@/components/donation-statistics-chart'
import { api } from '@/lib/api'
import { formatKES } from '@/lib/data'

type Transaction = {
  id: number
  donation_type: number
  donation_type_name: string
  amount: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
}

type AccountStat = {
  id: number
  name: string
  total: number
  count: number
}

export default function DonationTypesStatisticsPage() {
  const [accounts, setAccounts] = useState<AccountStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      const transactions: Transaction[] = await api.getTransactions()
      const successful = transactions.filter(tx => tx.status === 'SUCCESS')
      const grouped = groupTransactionsByAccount(successful)
      setAccounts(grouped)
    } catch (err: any) {
      console.error('[Statistics] fetch error:', err)
      toast.error(err?.body?.detail || err?.message || 'Failed to load statistics')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStats()
    toast.success('Statistics refreshed')
  }

  const totalDonations = accounts.reduce((sum, a) => sum + a.total, 0)
  const totalTransactions = accounts.reduce((sum, a) => sum + a.count, 0)
  const topAccount = accounts[0] || null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Type Statistics"
        description="Financial summary by donation category"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Donations"
          value={formatKES(totalDonations)}
          icon={HandCoins}
          accent="primary"
        />
        <StatCard
          label="Total Transactions"
          value={String(totalTransactions)}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Top Account"
          value={topAccount ? topAccount.name : 'N/A'}
          icon={TrendingUp}
          accent="amber"
        />
        <StatCard
          label="Top Account Amount"
          value={topAccount ? formatKES(topAccount.total) : 'KES 0'}
          icon={HandCoins}
          accent="teal"
        />
      </div>

      {accounts.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Donation Distribution (Bar)</CardTitle>
              <CardDescription>Total successful donations by account (KES)</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationStatisticsChart data={accounts} type="bar" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Donation Distribution (Pie)</CardTitle>
              <CardDescription>Share of total donations by account</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationStatisticsChart data={accounts} type="pie" />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Account Breakdown</CardTitle>
          <CardDescription>Successful donations per account</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No successful donations recorded yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Total (KES)</TableHead>
                    <TableHead className="text-center">Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell className="text-right font-semibold">{formatKES(account.total)}</TableCell>
                      <TableCell className="text-center">{account.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function groupTransactionsByAccount(transactions: Transaction[]): AccountStat[] {
  const map = new Map<string, {
    id: number
    name: string
    total: number
    count: number
  }>()

  for (const tx of transactions) {
    const key = tx.donation_type_name
    const amount = parseFloat(tx.amount) || 0

    if (!map.has(key)) {
      map.set(key, {
        id: tx.donation_type,
        name: key,
        total: 0,
        count: 0,
      })
    }

    const entry = map.get(key)!
    entry.total += amount
    entry.count += 1
  }

  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
}
