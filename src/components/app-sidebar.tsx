'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Landmark,
  Users,
  HandCoins,
  Gift,
  Building2,
  FolderKanban,
  Wallet,
  Receipt,
  TrendingUp,
  FileBarChart,
  ShieldCheck,
  FileText,
  UserCog,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const groups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { title: 'Treasury', href: '/app/treasury', icon: Landmark },
    ],
  },
  {
    label: 'Giving',
    items: [
      { title: 'Members', href: '/app/members', icon: Users },
      { title: 'Tithes', href: '/app/tithes', icon: HandCoins },
      { title: 'Offerings', href: '/app/offerings', icon: Gift },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Departments', href: '/app/departments', icon: Building2 },
      { title: 'Projects', href: '/app/projects', icon: FolderKanban },
      { title: 'Budgets', href: '/app/budgets', icon: Wallet },
      { title: 'Bank Accounts', href: '/app/bank-accounts', icon: Landmark },
    ],
  },
  {
    label: 'Ledger',
    items: [
      { title: 'Income', href: '/app/income', icon: TrendingUp },
      { title: 'Expenses', href: '/app/expenses', icon: Receipt },
    ],
  },
  {
    label: 'Governance',
    items: [
      { title: 'Reports', href: '/app/reports', icon: FileBarChart },
      { title: 'Audits', href: '/app/audits', icon: ShieldCheck },
      { title: 'Documents', href: '/app/documents', icon: FileText },
      { title: 'Users', href: '/app/users', icon: UserCog },
      { title: 'Profile', href: '/app/profile', icon: User },
      { title: 'Settings', href: '/app/settings', icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-10 flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1751876492/image-removebg-preview_hss6vx.png"
            alt="Logo"
            className="h-12 w-12 object-contain shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-sm font-bold text-sidebar-foreground">MKUSDA</span>
              <span className="text-xs text-muted-foreground">Treasury System</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden size-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <div className="text-sidebar-foreground/70 px-2 py-1.5 text-xs font-medium">
                {group.label}
              </div>
            )}
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = location.pathname === item.href || (item.href !== '/app/dashboard' && location.pathname.startsWith(item.href))
                return (
                  <Link key={item.href} to={item.href}>
                    <button
                      data-active={active}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                        collapsed && "justify-center"
                      )}
                    >
                      <item.icon className="size-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}

