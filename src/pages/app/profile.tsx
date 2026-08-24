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
  Save,
  X,
  Upload,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/page-header'

import { api } from '@/lib/api'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

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

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    profile_picture: '',
  })

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

  const startEdit = () => {
    setForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      username: profile?.username || '',
      profile_picture: profile?.profile_picture || '',
    })
    setFormError('')
    setEditing(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadImageToCloudinary(file)
      setForm((prev) => ({ ...prev, profile_picture: url }))
      toast.success('Image uploaded')
    } catch (err: any) {
      toast.error(err?.message || 'Image upload failed')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload: Record<string, string> = {}
      if (form.first_name.trim()) payload.first_name = form.first_name.trim()
      if (form.last_name.trim()) payload.last_name = form.last_name.trim()
      if (form.username.trim()) payload.username = form.username.trim()
      if (form.profile_picture.trim()) payload.profile_picture = form.profile_picture.trim()

      const updated = await api.updateProfile(payload)
      const merged = {
        ...profile,
        ...updated,
        name: updated.full_name || updated.username || updated.email,
        role: updated.role || profile?.role || 'User',
      }
      setProfile(merged)
      localStorage.setItem('user', JSON.stringify(merged))
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (err: any) {
      const msg = err?.body?.detail || err?.message || 'Failed to update profile'
      setFormError(typeof msg === 'string' ? msg : 'Failed to update profile')
      toast.error(typeof msg === 'string' ? msg : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

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
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={profile?.name}
                    className="size-full object-cover"
                  />
                ) : null}
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
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={startEdit}
                >
                  <Pencil className="size-4" />
                  Edit profile
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Details / Edit */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {editing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="First Name">
                      <Input
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        placeholder="First name"
                        disabled={saving}
                      />
                    </Field>
                    <Field label="Last Name">
                      <Input
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        placeholder="Last name"
                        disabled={saving}
                      />
                    </Field>
                    <Field label="Username" className="sm:col-span-2">
                      <Input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        placeholder="Username"
                        disabled={saving}
                      />
                    </Field>
                    <Field label="Profile Picture" className="sm:col-span-2">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                          {form.profile_picture ? (
                            <img
                              src={form.profile_picture}
                              alt="Preview"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <User className="size-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="profile-picture"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={saving || uploadingImage}
                          />
                          <label
                            htmlFor="profile-picture"
                            className="inline-flex h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <Upload className="size-4" />
                            {uploadingImage ? 'Uploading…' : 'Choose image'}
                          </label>
                          <Input
                            value={form.profile_picture}
                            onChange={(e) => setForm({ ...form, profile_picture: e.target.value })}
                            placeholder="https://res.cloudinary.com/.../avatar.jpg"
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </Field>
                    <Field label="Email" className="sm:col-span-2">
                      <Input value={profile?.email || ''} disabled />
                    </Field>

                    {formError && (
                      <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {formError}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 sm:col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2"
                        onClick={() => setEditing(false)}
                        disabled={saving}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                      <Button type="submit" className="gap-2" disabled={saving}>
                        {saving ? (
                          <span className="flex items-center gap-2">
                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving…
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Save className="size-4" />
                            Save changes
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
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
            )}

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

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label className="text-gray-700 font-medium">{label}</Label>
      {children}
    </div>
  )
}
