'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileBarChart,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  HandCoins,
  Wallet,
  ArrowLeft,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import { CHURCH, formatKES } from '@/lib/data'

// Sample data for charts
const monthlyData = [
  { month: 'Jan', income: 45000, expenses: 32000, tithes: 28000, offerings: 17000 },
  { month: 'Feb', income: 52000, expenses: 28000, tithes: 32000, offerings: 20000 },
  { month: 'Mar', income: 48000, expenses: 35000, tithes: 30000, offerings: 18000 },
  { month: 'Apr', income: 61000, expenses: 31000, tithes: 38000, offerings: 23000 },
  { month: 'May', income: 55000, expenses: 38000, tithes: 34000, offerings: 21000 },
  { month: 'Jun', income: 67000, expenses: 33000, tithes: 42000, offerings: 25000 },
]

const departmentData = [
  { name: 'Worship', amount: 45000, budget: 50000 },
  { name: 'Youth', amount: 32000, budget: 40000 },
  { name: 'Women', amount: 28000, budget: 35000 },
  { name: 'Ushering', amount: 15000, budget: 20000 },
  { name: 'Technical', amount: 25000, budget: 30000 },
]

const fundDistribution = [
  { name: 'Tithes', value: 45, color: '#4F46E5' },
  { name: 'Offerings', value: 25, color: '#8B5CF6' },
  { name: 'Building Fund', value: 20, color: '#06B6D4' },
  { name: 'Development', value: 10, color: '#F59E0B' },
]

const recentTransactions = [
  { id: 1, description: 'Sunday Tithe', amount: 15000, type: 'income', date: '2026-08-20', category: 'Tithe' },
  { id: 2, description: 'Electricity Bill', amount: 4500, type: 'expense', date: '2026-08-19', category: 'Utilities' },
  { id: 3, description: 'Offering', amount: 8000, type: 'income', date: '2026-08-18', category: 'Offering' },
  { id: 4, description: 'Church Supplies', amount: 3200, type: 'expense', date: '2026-08-17', category: 'Supplies' },
  { id: 5, description: 'Building Fund', amount: 12000, type: 'income', date: '2026-08-16', category: 'Building' },
]

const reportTypes = [
  { value: 'financial', label: 'Financial Report', icon: FileBarChart },
  { value: 'income', label: 'Income Report', icon: TrendingUp },
  { value: 'expense', label: 'Expense Report', icon: TrendingDown },
  { value: 'tithe', label: 'Tithe Report', icon: HandCoins },
  { value: 'offering', label: 'Offering Report', icon: DollarSign },
  { value: 'member', label: 'Member Report', icon: Users },
]

export default function ReportsPage() {
  const navigate = useNavigate()
  const [selectedReport, setSelectedReport] = useState('financial')
  const [dateRange, setDateRange] = useState('this-month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const totalIncome = monthlyData.reduce((sum, d) => sum + d.income, 0)
  const totalExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0)
  const netPosition = totalIncome - totalExpenses
  const totalTithes = monthlyData.reduce((sum, d) => sum + d.tithes, 0)
  const totalOfferings = monthlyData.reduce((sum, d) => sum + d.offerings, 0)

  const handleGenerateReport = () => {
    setIsLoading(true)
    setTimeout(() => {
      setGeneratedReport({
        title: `${reportTypes.find(r => r.value === selectedReport)?.label}`,
        date: new Date().toISOString().split('T')[0],
        summary: {
          totalIncome,
          totalExpenses,
          netPosition,
          totalTithes,
          totalOfferings,
          totalMembers: 150
        }
      })
      setIsLoading(false)
      setIsGenerateDialogOpen(false)
    }, 1500)
  }

  const handleExport = () => {
    // Simulate export
    alert('Report exported successfully!')
  }

  const handlePrint = () => {
    window.print()
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
              <h1 className="text-lg font-bold text-gray-800">Reports</h1>
              <p className="text-xs text-gray-500">Generate and view financial reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <FileBarChart className="w-4 h-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Report</DialogTitle>
                  <DialogDescription>
                    Select the report type and date range.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="this-quarter">This Quarter</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileBarChart className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Report Type Tabs */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="mb-6">
          <TabsList className="bg-white border shadow-sm">
            {reportTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="gap-2">
                <type.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatKES(totalIncome)}</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-2xl font-bold text-rose-600">{formatKES(totalExpenses)}</p>
                </div>
                <div className="p-2 bg-rose-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Position</p>
                  <p className={`text-2xl font-bold ${netPosition >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {formatKES(netPosition)}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tithe & Offerings</p>
                  <p className="text-2xl font-bold text-purple-600">{formatKES(totalTithes + totalOfferings)}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <HandCoins className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      formatter={(value) => formatKES(value as number)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Fund Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Fund Distribution</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
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
                      {fundDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tithes & Offerings Chart */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tithes & Offerings Trend</CardTitle>
            <CardDescription>Monthly collection trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    formatter={(value) => formatKES(value as number)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="tithes" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="offerings" stroke="#8B5CF6" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Budget vs Actual */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Department Budget vs Actual</CardTitle>
            <CardDescription>Budget utilization by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => {
                const percentage = (dept.amount / dept.budget) * 100
                const isOverBudget = percentage > 100
                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.name}</span>
                      <span>
                        <span className="font-medium">{formatKES(dept.amount)}</span>
                        <span className="text-gray-400"> / {formatKES(dept.budget)}</span>
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${isOverBudget ? 'bg-rose-100' : 'bg-gray-100'}`}
                    />
                    <div className="flex justify-between text-xs">
                      <span className={isOverBudget ? 'text-rose-600' : 'text-emerald-600'}>
                        {percentage.toFixed(0)}% utilized
                      </span>
                      {isOverBudget && (
                        <span className="text-rose-600 font-medium">Over budget!</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <CardDescription>Latest financial activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
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
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                      </div>
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

        {/* Generated Report Preview */}
        {generatedReport && (
          <Card className="border-2 border-blue-100 shadow-sm mt-6">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileBarChart className="w-5 h-5 text-blue-600" />
                    {generatedReport.title} Report
                  </CardTitle>
                  <CardDescription>Generated on {generatedReport.date}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Income</p>
                  <p className="text-lg font-bold text-emerald-600">{formatKES(generatedReport.summary.totalIncome)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Expenses</p>
                  <p className="text-lg font-bold text-rose-600">{formatKES(generatedReport.summary.totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Position</p>
                  <p className={`text-lg font-bold ${generatedReport.summary.netPosition >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {formatKES(generatedReport.summary.netPosition)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tithes</p>
                  <p className="text-lg font-bold text-purple-600">{formatKES(generatedReport.summary.totalTithes)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Offerings</p>
                  <p className="text-lg font-bold text-indigo-600">{formatKES(generatedReport.summary.totalOfferings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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