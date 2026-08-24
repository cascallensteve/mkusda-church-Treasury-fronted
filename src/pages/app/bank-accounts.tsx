'use client'

import { useState } from 'react'
import { Landmark, Wallet, ArrowUpRight, ArrowDownRight, Search, Plus, ArrowLeft, Loader2, CheckCircle2, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, formatKES, bankAccounts as initialAccounts, bankTransactions as initialTransactions } from '@/lib/data'

type BankAccount = {
  id: string
  bank: string
  accountNumber: string
  branch: string
  balance: number
  type: string
}

type BankTransaction = {
  id: string
  date: string
  description: string
  account: string
  type: string
  amount: number
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts)
  const [transactions, setTransactions] = useState<BankTransaction[]>(initialTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('all')
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [isTxnDialogOpen, setIsTxnDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAccountItem, setSelectedAccountItem] = useState<BankAccount | null>(null)

  const [accountForm, setAccountForm] = useState({
    bank: '',
    accountNumber: '',
    branch: '',
    balance: '',
    type: 'Current',
  })

  const [txnForm, setTxnForm] = useState({
    account: 'KCB Bank',
    type: 'Deposit',
    amount: '',
    description: '',
  })

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalDeposits = transactions.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0)

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.account.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAccount = selectedAccount === 'all' || txn.account === selectedAccount
    return matchesSearch && matchesAccount
  })

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newAccount: BankAccount = {
        id: `ACC-${Date.now()}`,
        bank: accountForm.bank,
        accountNumber: accountForm.accountNumber,
        branch: accountForm.branch,
        balance: Number(accountForm.balance) || 0,
        type: accountForm.type,
      }
      setAccounts([...accounts, newAccount])
      setAccountForm({ bank: '', accountNumber: '', branch: '', balance: '', type: 'Current' })
      setIsAccountDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccountItem(account)
    setAccountForm({
      bank: account.bank,
      accountNumber: account.accountNumber,
      branch: account.branch,
      balance: String(account.balance),
      type: account.type,
    })
    setIsEditAccountOpen(true)
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccountItem) return
    setIsLoading(true)
    setTimeout(() => {
      setAccounts(accounts.map(a =>
        a.id === selectedAccountItem.id ? {
          ...a,
          bank: accountForm.bank,
          accountNumber: accountForm.accountNumber,
          branch: accountForm.branch,
          balance: Number(accountForm.balance) || 0,
          type: accountForm.type,
        } : a
      ))
      setIsEditAccountOpen(false)
      setIsLoading(false)
      setSelectedAccountItem(null)
      setAccountForm({ bank: '', accountNumber: '', branch: '', balance: '', type: 'Current' })
    }, 800)
  }

  const handleDeleteAccount = (account: BankAccount) => {
    if (window.confirm(`Are you sure you want to delete ${account.bank} account?`)) {
      setAccounts(accounts.filter(a => a.id !== account.id))
    }
  }

  const handleTxnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTxnForm(prev => ({ ...prev, [name]: value }))
  }

  const handleTxnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newTxn: BankTransaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: txnForm.description,
        account: txnForm.account,
        type: txnForm.type,
        amount: Number(txnForm.amount) || 0,
      }
      setTransactions([newTxn, ...transactions])
      setTxnForm({ account: 'KCB Bank', type: 'Deposit', amount: '', description: '' })
      setIsTxnDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Bank Accounts"
          description={`Manage church bank accounts, balances, and transaction history for ${CHURCH.name}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setIsAccountDialogOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Landmark className="w-4 h-4" />
                Add Account
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsTxnDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Record Transaction
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Balance" value={formatKES(totalBalance, { compact: true })} icon={Wallet} accent="primary" />
          <StatCard label="Total Deposits" value={formatKES(totalDeposits, { compact: true })} icon={ArrowUpRight} accent="emerald" />
          <StatCard label="Total Withdrawals" value={formatKES(totalWithdrawals, { compact: true })} icon={ArrowDownRight} accent="amber" />
          <StatCard label="Accounts" value={String(accounts.length)} icon={Landmark} accent="teal" />
        </div>

        {isAccountDialogOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsAccountDialogOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Add New Bank Account</h2>
                  <p className="text-sm text-muted-foreground">Enter the bank account details below.</p>
                </div>
              </div>

              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Bank Name *</Label>
                    <Input id="bank" name="bank" value={accountForm.bank} onChange={handleAccountInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input id="accountNumber" name="accountNumber" value={accountForm.accountNumber} onChange={handleAccountInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Input id="branch" name="branch" value={accountForm.branch} onChange={handleAccountInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance (KES) *</Label>
                    <Input id="balance" name="balance" type="number" value={accountForm.balance} onChange={handleAccountInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type *</Label>
                    <Select value={accountForm.type} onValueChange={(value) => setAccountForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Building Fund">Building Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Add Account</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : isTxnDialogOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsTxnDialogOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Record New Transaction</h2>
                  <p className="text-sm text-muted-foreground">Enter the transaction details below.</p>
                </div>
              </div>

              <form onSubmit={handleTxnSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account">Bank Account *</Label>
                    <Select value={txnForm.account} onValueChange={(value) => setTxnForm(prev => ({ ...prev, account: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.bank}>{acc.bank} ({acc.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type *</Label>
                    <Select value={txnForm.type} onValueChange={(value) => setTxnForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Deposit">Deposit</SelectItem>
                        <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input id="amount" name="amount" type="number" value={txnForm.amount} onChange={handleTxnInputChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input id="description" name="description" value={txnForm.description} onChange={handleTxnInputChange} required />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsTxnDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Transaction</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {accounts.map((account) => (
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
                      <Badge variant="secondary" className="text-xs font-mono">
                        {account.accountNumber}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Balance</p>
                      <p className="text-2xl font-bold text-gray-800">{formatKES(account.balance)}</p>
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
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="font-serif">Recent Transactions</CardTitle>
                    <CardDescription>Latest activity across all bank accounts</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                    </div>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map(acc => (
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
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                            <TableCell className="text-sm">{txn.date}</TableCell>
                            <TableCell className="text-sm font-medium">{txn.description}</TableCell>
                            <TableCell className="text-sm">{txn.account}</TableCell>
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
              </CardContent>
            </Card>
          </>
        )}

        {/* Edit Account Dialog */}
        <Dialog open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Bank Account</DialogTitle>
              <DialogDescription>Update the account details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bank">Bank Name *</Label>
                  <Input id="edit-bank" name="bank" value={accountForm.bank} onChange={handleAccountInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-accountNumber">Account Number *</Label>
                  <Input id="edit-accountNumber" name="accountNumber" value={accountForm.accountNumber} onChange={handleAccountInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-branch">Branch *</Label>
                  <Input id="edit-branch" name="branch" value={accountForm.branch} onChange={handleAccountInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-balance">Current Balance (KES) *</Label>
                  <Input id="edit-balance" name="balance" type="number" value={accountForm.balance} onChange={handleAccountInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Account Type *</Label>
                  <Select value={accountForm.type} onValueChange={(value) => setAccountForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Building Fund">Building Fund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditAccountOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
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
