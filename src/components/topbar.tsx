'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Wifi, WifiOff, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CHURCH, notifications } from '@/lib/data'
import { api, clearTokens } from '@/lib/api'

export function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const cached = localStorage.getItem('user')
    if (cached) {
      try {
        setUser(JSON.parse(cached))
      } catch {
        /* ignore malformed cache */
      }
    }

    let cancelled = false
    api.getProfile()
      .then((profile) => {
        if (cancelled) return
        const merged = {
          ...profile,
          name: profile.full_name || profile.username || profile.email,
          role: profile.role || 'User',
        }
        setUser(merged)
        localStorage.setItem('user', JSON.stringify(merged))
      })
      .catch(() => {
        /* keep cached user if fetch fails */
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        await api.logout(refresh)
      }
    } catch {
      // ignore logout API errors, still clear local state
    } finally {
      clearTokens()
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      {onToggleSidebar && (
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onToggleSidebar}>
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      )}
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members, receipts, reports..."
          className="pl-9"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="secondary" className="hidden font-medium sm:inline-flex">
          FY {CHURCH.financialYear}
        </Badge>

        <Badge variant={isOnline ? "default" : "destructive"} className="hidden font-medium sm:inline-flex">
          {isOnline ? (
            <>
              <Wifi className="mr-1 size-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="mr-1 size-3" />
              Offline
            </>
          )}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.title} className="flex flex-col items-start gap-0.5 py-2">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.detail}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pl-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name
                  ? user.name.split(/\s+/).filter(Boolean).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                  : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.role || 'User'}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || 'My Account'}</span>
              </div>
            </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/app/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
