'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { CHURCH, formatKES } from '@/lib/data'

// Sample data - replace with your actual data
const monthlyData = [
  { name: 'Jan', income: 45000, expenses: 32000 },
  { name: 'Feb', income: 52000, expenses: 28000 },
  { name: 'Mar', income: 48000, expenses: 35000 },
  { name: 'Apr', income: 61000, expenses: 31000 },
  { name: 'May', income: 55000, expenses: 38000 },
  { name: 'Jun', income: 67000, expenses: 33000 },
]

const fundDistribution = [
  { name: 'Tithes', value: 45 },
  { name: 'Offerings', value: 25 },
  { name: 'Building Fund', value: 20 },
  { name: 'Development', value: 10 },
]

const COLORS = ['#4F46E5', '#8B5CF6', '#06B6D4', '#F59E0B']

const recentTransactions = [
  { id: 1, type: 'income', description: 'Sunday Tithe', amount: 15000, date: '2026-08-20' },
  { id: 2, type: 'expense', description: 'Electricity Bill', amount: 4500, date: '2026-08-19' },
  { id: 3, type: 'income', description: 'Offering', amount: 8000, date: '2026-08-18' },
  { id: 4, type: 'expense', description: 'Church Supplies', amount: 3200, date: '2026-08-17' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [navigate])

  // Stats data
  const stats = [
    { label: 'Total Income', value: 328000, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Expenses', value: 197000, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Bank Balance', value: 131000, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cash on Hand', value: 45000, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const totalIncome = stats[0].value
  const totalExpenses = stats[1].value
  const netPosition = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'Anna'}!</h2>
          <p className="text-gray-500 text-sm">Here's your financial overview for {CHURCH.financialYear}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatKES(stat.value, { compact: true })}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Net Position Card */}
        <Card className="border-0 shadow-sm mb-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-indigo-100 text-sm">Net Position</p>
                <p className="text-3xl font-bold text-white">
                  {formatKES(netPosition)}
                </p>
                <p className="text-indigo-200 text-sm mt-1">
                  {netPosition > 0 ? 'Surplus' : 'Deficit'} for the year
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-indigo-100 text-xs">Income</p>
                  <p className="text-white font-semibold">{formatKES(totalIncome, { compact: true })}</p>
                </div>
                <div className="text-center">
                  <p className="text-indigo-100 text-xs">Expenses</p>
                  <p className="text-white font-semibold">{formatKES(totalExpenses, { compact: true })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => formatKES(value as number)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Fund Distribution Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Fund Distribution</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fundDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {fundDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <CardDescription>Latest financial activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className={`w-4 h-4 text-emerald-600`} />
                      ) : (
                        <ArrowDownRight className={`w-4 h-4 text-rose-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatKES(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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