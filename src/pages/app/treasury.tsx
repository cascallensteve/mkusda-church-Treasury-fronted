'use client'

import { useState } from 'react'
import {
  Landmark,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  RefreshCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
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
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES } from '@/lib/data'

const bankAccounts = [
  { id: 'ACC-1', bank: 'KCB Bank', accountNumber: '****4821', branch: 'Nairobi Main', balance: 4120450, type: 'Current' },
  { id: 'ACC-2', bank: 'Equity Bank', accountNumber: '****1093', branch: 'Kenyatta Avenue', balance: 1685000, type: 'Savings' },
  { id: 'ACC-3', bank: 'Co-operative Bank', accountNumber: '****7756', branch: 'City Centre', balance: 315000, type: 'Building Fund' },
]

const bankTransactions = [
  { id: 'TXN-1', date: '2026-07-11', description: 'Sabbath collection deposit', account: 'KCB Bank', type: 'Deposit', amount: 296400 },
  { id: 'TXN-2', date: '2026-07-09', description: 'Building fund pledge', account: 'Co-operative Bank', type: 'Deposit', amount: 350000 },
  { id: 'TXN-3', date: '2026-07-08', description: 'Electricity & water payment', account: 'KCB Bank', type: 'Withdrawal', amount: 48500 },
  { id: 'TXN-4', date: '2026-07-05', description: 'Pastor stipend', account: 'KCB Bank', type: 'Withdrawal', amount: 180000 },
  { id: 'TXN-5', date: '2026-07-02', description: 'Transfer to savings', account: 'Equity Bank', type: 'Deposit', amount: 200000 },
  { id: 'TXN-6', date: '2026-06-29', description: 'Crusade materials', account: 'KCB Bank', type: 'Withdrawal', amount: 142000 },
  { id: 'TXN-7', date: '2026-06-25', description: 'Youth camp transport', account: 'Equity Bank', type: 'Withdrawal', amount: 63500 },
  { id: 'TXN-8', date: '2026-06-20', description: 'Special offering deposit', account: 'KCB Bank', type: 'Deposit', amount: 210000 },
]

const recentTransactions = [
  { id: 'TXN-1', date: '2026-07-11', description: 'Sabbath collection deposit', account: 'KCB Bank', type: 'Deposit', amount: 296400, category: 'Income' },
  { id: 'TXN-2', date: '2026-07-09', description: 'Building fund pledge', account: 'Co-operative Bank', type: 'Deposit', amount: 350000, category: 'Income' },
  { id: 'TXN-3', date: '2026-07-08', description: 'Electricity & water payment', account: 'KCB Bank', type: 'Withdrawal', amount: 48500, category: 'Utilities' },
  { id: 'TXN-4', date: '2026-07-05', description: 'Pastor stipend', account: 'KCB Bank', type: 'Withdrawal', amount: 180000, category: 'Pastor Support' },
  { id: 'TXN-5', date: '2026-07-02', description: 'Transfer to savings', account: 'Equity Bank', type: 'Deposit', amount: 200000, category: 'Transfer' },
  { id: 'TXN-6', date: '2026-06-29', description: 'Crusade materials', account: 'KCB Bank', type: 'Withdrawal', amount: 142000, category: 'Evangelism' },
  { id: 'TXN-7', date: '2026-06-25', description: 'Youth camp transport', account: 'Equity Bank', type: 'Withdrawal', amount: 63500, category: 'Youth Ministry' },
  { id: 'TXN-8', date: '2026-06-20', description: 'Special offering deposit', account: 'KCB Bank', type: 'Deposit', amount: 210000, category: 'Income' },
]

export default function TreasuryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedAccount, setSelectedAccount] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReconcileDialogOpen, setIsReconcileDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [formData, setFormData] = useState({
    type: 'Deposit',
    account: 'KCB Bank',
    amount: '',
    category: 'Income',
    description: '',
    reference: '',
    notes: '',
  })

  const totalIncome = bankTransactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = bankTransactions
    .filter(t => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0)

  const filteredTransactions = recentTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || t.type.toLowerCase() === selectedType.toLowerCase()
    const matchesAccount = selectedAccount === 'all' || t.account === selectedAccount
    return matchesSearch && matchesType && matchesAccount
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(formData.amount)
    if (!amount || amount <= 0) return

    alert('Transaction recorded successfully!')
    setIsDialogOpen(false)
    setFormData({
      type: 'Deposit',
      account: 'KCB Bank',
      amount: '',
      category: 'Income',
      description: '',
      reference: '',
      notes: '',
    })
  }

  const handleReconcile = () => {
    alert('Bank reconciliation completed successfully!')
    setIsReconcileDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Treasury Management"
          description={`Financial overview and bank management for ${CHURCH.name}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus className="w-4 h-4" />
                Record Transaction
              </Button>

              <Dialog open={isReconcileDialogOpen} onOpenChange={setIsReconcileDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Reconcile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bank Reconciliation</DialogTitle>
                    <DialogDescription>
                      Reconcile your bank accounts with the latest statements.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="reconcile-account">Select Account</Label>
                      <Select defaultValue="KCB Bank">
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.bank}>{acc.bank} — {formatKES(acc.balance)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statement-balance">Statement Balance (KES)</Label>
                      <Input id="statement-balance" type="number" placeholder="Enter statement balance" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reconcile-notes">Reconciliation Notes</Label>
                      <Textarea id="reconcile-notes" placeholder="Any discrepancies or notes..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsReconcileDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleReconcile} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      Complete Reconciliation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          }
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            label="Total Balance"
            value={formatKES(totalBalance, { compact: true })}
            icon={Wallet}
            accent="primary"
          />
          <StatCard
            label="Total Income"
            value={formatKES(totalIncome, { compact: true })}
            icon={ArrowUpRight}
            accent="emerald"
          />
          <StatCard
            label="Total Expenses"
            value={formatKES(totalExpenses, { compact: true })}
            icon={ArrowDownRight}
            accent="amber"
          />
          <StatCard
            label="Net Position"
            value={formatKES(totalIncome - totalExpenses, { compact: true })}
            icon={Landmark}
            accent="teal"
          />
          <StatCard
            label="Accounts"
            value={String(bankAccounts.length)}
            icon={Landmark}
            accent="primary"
          />
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
                  <h2 className="text-lg font-semibold">Record New Transaction</h2>
                  <p className="text-sm text-muted-foreground">Enter the transaction details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Deposit">Deposit</SelectItem>
                        <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">Bank Account *</Label>
                    <Select value={formData.account} onValueChange={(value) => handleSelectChange('account', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.bank}>{acc.bank} ({acc.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Tithes">Tithes</SelectItem>
                        <SelectItem value="Offerings">Offerings</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Pastor Support">Pastor Support</SelectItem>
                        <SelectItem value="Evangelism">Evangelism</SelectItem>
                        <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                        <SelectItem value="Welfare">Welfare</SelectItem>
                        <SelectItem value="Building Projects">Building Projects</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Transaction description"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="reference">Reference Number</Label>
                    <Input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="e.g. Receipt #, Check #"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Save Transaction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="font-serif">Recent Transactions</CardTitle>
                      <CardDescription>Latest financial activity across all accounts</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                          className="pl-9 w-full sm:w-64"
                        />
                      </div>
                      <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); setCurrentPage(1) }}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Deposit">Deposits</SelectItem>
                          <SelectItem value="Withdrawal">Withdrawals</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedAccount} onValueChange={(value) => { setSelectedAccount(value); setCurrentPage(1) }}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Accounts</SelectItem>
                          {bankAccounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.bank}>{acc.bank}</SelectItem>
                          ))}
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
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No transactions found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedTransactions.map((txn) => (
                            <TableRow key={txn.id}>
                              <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                              <TableCell className="text-sm">{txn.date}</TableCell>
                              <TableCell className="text-sm font-medium">{txn.description}</TableCell>
                              <TableCell className="text-sm">{txn.account}</TableCell>
                              <TableCell className="text-sm">{txn.category}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    txn.type === 'Deposit'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }
                                >
                                  {txn.type}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-semibold text-sm ${txn.type === 'Deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {txn.type === 'Deposit' ? '+' : '-'}{formatKES(txn.amount)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">{account.bank}</CardTitle>
                            <CardDescription className="text-xs">{account.type} • {account.branch}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {account.accountNumber}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Balance</p>
                          <p className="text-xl font-bold text-gray-800">{formatKES(account.balance)}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Account ID</span>
                          <span className="font-mono text-xs">{account.id}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Branch</span>
                          <span className="text-xs">{account.branch}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Footer */}
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
