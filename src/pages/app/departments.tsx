'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, TrendingUp, TrendingDown, Wallet, Search, Users } from 'lucide-react'

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

import { CHURCH, formatKES, departments } from '@/lib/data'

type Department = {
  name: string
  budget: number
  income: number
  expenses: number
  leader: string
}

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0)
  const totalIncome = departments.reduce((sum, d) => sum + d.income, 0)
  const totalExpenses = departments.reduce((sum, d) => sum + d.expenses, 0)

  const filteredDepartments = departments.filter((dept: Department) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const budgetStatus = dept.expenses > dept.budget ? 'over' : dept.expenses > dept.budget * 0.8 ? 'near' : 'good'
    const matchesStatus = selectedStatus === 'all' || budgetStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getBudgetStatus = (dept: Department) => {
    if (dept.expenses > dept.budget) return { label: 'Over Budget', color: 'bg-rose-100 text-rose-700 border-rose-200' }
    if (dept.expenses > dept.budget * 0.8) return { label: 'Near Limit', color: 'bg-amber-100 text-amber-700 border-amber-200' }
    return { label: 'On Track', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
  }

  const getProgressColor = (dept: Department) => {
    const ratio = dept.expenses / dept.budget
    if (ratio > 1) return 'bg-rose-500'
    if (ratio > 0.8) return 'bg-amber-500'
    return 'bg-emerald-500'
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
              <h1 className="text-lg font-bold text-gray-800">Departments</h1>
              <p className="text-xs text-gray-500">Financial overview by department</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
            <Building2 className="w-3 h-3" />
            {departments.length} Departments
          </Badge>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-indigo-700">{formatKES(totalBudget)}</p>
                  <p className="text-xs text-gray-500 mt-1">All departments</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-100">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatKES(totalIncome)}</p>
                  <p className="text-xs text-gray-500 mt-1">Combined revenue</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-amber-700">{formatKES(totalExpenses)}</p>
                  <p className="text-xs text-gray-500 mt-1">Combined spending</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100">
                  <TrendingDown className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by department or leader..."
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
              <SelectItem value="good">On Track</SelectItem>
              <SelectItem value="near">Near Limit</SelectItem>
              <SelectItem value="over">Over Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Departments Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Department List</CardTitle>
                <CardDescription>
                  {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Leader</TableHead>
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Income</TableHead>
                    <TableHead className="font-semibold">Expenses</TableHead>
                    <TableHead className="font-semibold">Progress</TableHead>
                    <TableHead className="font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        No departments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((dept, index) => {
                      const status = getBudgetStatus(dept)
                      const progress = Math.min((dept.expenses / dept.budget) * 100, 100)
                      return (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{dept.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{dept.leader}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            {formatKES(dept.budget)}
                          </TableCell>
                          <TableCell className="text-sm text-emerald-600 font-medium">
                            {formatKES(dept.income)}
                          </TableCell>
                          <TableCell className="text-sm text-rose-600 font-medium">
                            {formatKES(dept.expenses)}
                          </TableCell>
                          <TableCell>
                            <div className="w-full">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">{Math.round(progress)}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getProgressColor(dept)}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
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
