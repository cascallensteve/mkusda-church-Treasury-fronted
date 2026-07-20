'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Settings,
  Church,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { CHURCH } from '@/lib/data'

const groups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
      { title: 'Treasury', href: '/treasury', icon: Landmark },
    ],
  },
  {
    label: 'Giving',
    items: [
      { title: 'Members', href: '/members', icon: Users },
      { title: 'Tithes', href: '/tithes', icon: HandCoins },
      { title: 'Offerings', href: '/offerings', icon: Gift },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Departments', href: '/departments', icon: Building2 },
      { title: 'Projects', href: '/projects', icon: FolderKanban },
      { title: 'Budgets', href: '/budgets', icon: Wallet },
      { title: 'Bank Accounts', href: '/bank-accounts', icon: Landmark },
    ],
  },
  {
    label: 'Ledger',
    items: [
      { title: 'Income', href: '/income', icon: TrendingUp },
      { title: 'Expenses', href: '/expenses', icon: Receipt },
    ],
  },
  {
    label: 'Governance',
    items: [
      { title: 'Reports', href: '/reports', icon: FileBarChart },
      { title: 'Audits', href: '/audits', icon: ShieldCheck },
      { title: 'Documents', href: '/documents', icon: FileText },
      { title: 'Users', href: '/users', icon: UserCog },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Church className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-sm font-bold text-sidebar-foreground">MKUSDA</span>
            <span className="text-xs text-muted-foreground">Treasury System</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
