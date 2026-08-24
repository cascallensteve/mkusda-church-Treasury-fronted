'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  ShieldCheck,
  CalendarDays,
  KeyRound,
  User,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Pencil,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'

import { api } from '@/lib/api'

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getProfile()
      .then((data) => {
        if (cancelled) return
        const merged = {
          ...data,
          name: data.full_name || data.username || data.email,
          role: data.role || 'User',
        }
        setProfile(merged)
        localStorage.setItem('user', JSON.stringify(merged))
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message || 'Failed to load profile')
        toast.error(err?.message || 'Failed to load profile')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const pinComplete = !!profile?.pin_setup_complete

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-2 text-muted-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <PageHeader
        title="My Profile"
        description="View and manage your account details."
      />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            Loading profile…
          </div>
        </div>
      ) : error && !profile ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Identity card */}
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <Avatar className="size-24 text-2xl">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="default">{profile?.role}</Badge>
                {pinComplete ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="size-3" />
                    PIN set
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-amber-600">
                    <AlertCircle className="size-3" />
                    PIN not set
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" className="mt-2 gap-2" disabled>
                <Pencil className="size-4" />
                Edit profile
              </Button>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your registered information.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow
                  icon={AtSign}
                  label="Username"
                  value={profile?.username || '—'}
                />
                <DetailRow
                  icon={Mail}
                  label="Email"
                  value={profile?.email || '—'}
                />
                <DetailRow
                  icon={User}
                  label="Full Name"
                  value={profile?.full_name || '—'}
                />
                <DetailRow
                  icon={ShieldCheck}
                  label="Role"
                  value={profile?.role || 'User'}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Member since"
                  value={formatDate(profile?.created_at)}
                />
                <DetailRow
                  icon={KeyRound}
                  label="PIN Setup"
                  value={pinComplete ? 'Completed' : 'Not completed'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your account protected.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <KeyRound className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {pinComplete ? 'PIN active' : 'Set up your PIN'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pinComplete
                          ? 'Your security PIN is enabled for this account.'
                          : 'Add a PIN to secure future sign-ins.'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={pinComplete ? 'secondary' : 'outline'}>
                    {pinComplete ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
