'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Church, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Settings,
  Bell
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CHURCH, summary, summaryTrends, departments, notifications } from '@/lib/data'
import { formatKES } from '@/lib/data'

export default function DashboardPage() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const stats = [
    {
      title: 'Total Income',
      value: formatKES(summary.totalIncome),
      change: summaryTrends.totalIncome,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Total Expenses',
      value: formatKES(summary.totalExpenses),
      change: summaryTrends.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      title: 'Bank Balance',
      value: formatKES(summary.bankBalance),
      change: summaryTrends.bankBalance,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active Members',
      value: members.length.toString(),
      change: 5.2,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Church className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{CHURCH.name}</h1>
              <p className="text-xs text-muted-foreground">{CHURCH.system}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="hidden sm:inline-flex">
              {isOnline ? 'Online' : 'Offline'}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.slice(0, 4).map((n, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2">
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.detail}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">AM</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Anna Mushi</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 w-4 h-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Anna!</h2>
          <p className="text-muted-foreground">Here's what's happening with {CHURCH.name} treasury.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-2 text-sm">
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={stat.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground"
              onClick={() => router.push('/app/tithes')}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-sm">Record Tithe</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground"
              onClick={() => router.push('/app/expenses')}
            >
              <TrendingDown className="w-6 h-6" />
              <span className="text-sm">Add Expense</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground"
              onClick={() => router.push('/app/bank-accounts')}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm">View Accounts</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground"
              onClick={() => router.push('/app/reports')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity & Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notifications */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Important alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 4).map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.kind === 'danger' ? 'bg-red-500' :
                      notification.kind === 'warning' ? 'bg-yellow-500' :
                      notification.kind === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Financial status by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departments.slice(0, 5).map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.leader}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatKES(dept.income, { compact: true })}</p>
                      <p className="text-xs text-muted-foreground">of {formatKES(dept.budget, { compact: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="border-2 mt-6">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Overview of church finances for FY {CHURCH.financialYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm text-muted-foreground mb-1">Tithe Received</p>
                <p className="text-xl font-bold text-green-600">{formatKES(summary.titheReceived, { compact: true })}</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm text-muted-foreground mb-1">Offering Received</p>
                <p className="text-xl font-bold text-blue-600">{formatKES(summary.offeringReceived, { compact: true })}</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                <p className="text-sm text-muted-foreground mb-1">Building Fund</p>
                <p className="text-xl font-bold text-purple-600">{formatKES(summary.buildingFund, { compact: true })}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-sm text-muted-foreground mb-1">Cash on Hand</p>
                <p className="text-xl font-bold text-orange-600">{formatKES(summary.cashOnHand, { compact: true })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>{CHURCH.system} • {CHURCH.location}</p>
          <p className="mt-1">© 2026 {CHURCH.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
