'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Shield, Loader2, Users } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { api } from '@/lib/api'

type Admin = {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  profile_picture?: string
  created_at: string
}

export default function TreasuryPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    password: '',
  })

  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      const data = await api.getFullProfile()
      setAdmins(data.admins || [])
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Failed to load admins')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Name, email and password are required')
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedAdmin) {
        toast.success('Admin updated successfully')
      } else {
        toast.success('Admin added successfully')
      }
      setIsFormOpen(false)
      setSelectedAdmin(null)
      setFormData({ name: '', email: '', phone: '', role: 'Admin', password: '' })
      fetchAdmins()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      role: admin.role,
      password: '',
    })
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedAdmin) return
    setIsSubmitting(true)
    try {
      toast.success('Admin deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedAdmin(null)
      fetchAdmins()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFormOpen) {
    return (
      <div className="relative min-h-[500px]">
        <Card className="absolute inset-0 z-10 overflow-auto rounded-none border-0 shadow-lg">
          <CardContent className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={() => { setIsFormOpen(false); setSelectedAdmin(null); setFormData({ name: '', email: '', phone: '', role: 'Admin', password: '' }) }} className="gap-2">
                <Shield className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{selectedAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
                <p className="text-sm text-muted-foreground">{selectedAdmin ? 'Update admin details' : 'Create a new admin account'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="admin@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="254XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={formData.role} onChange={handleInputChange} placeholder="Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{selectedAdmin ? 'New Password (leave blank to keep current)' : 'Password *'}</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" required={!selectedAdmin} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setSelectedAdmin(null); setFormData({ name: '', email: '', phone: '', role: 'Admin', password: '' }) }} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {selectedAdmin ? 'Save Changes' : 'Add Admin'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage admin accounts and permissions"
        actions={
          <Button size="sm" onClick={() => { setSelectedAdmin(null); setFormData({ name: '', email: '', phone: '', role: 'Admin', password: '' }); setIsFormOpen(true) }}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Admin
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Admins" value={String(admins.length)} icon={Users} accent="primary" />
        <StatCard label="Active" value={String(admins.length)} icon={Shield} accent="emerald" />
        <StatCard label="Roles" value={String(new Set(admins.map(a => a.role)).size)} icon={Shield} accent="amber" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">All Admins</CardTitle>
          <CardDescription>View and manage admin accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No admins found. Add your first admin!</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {admins.map((admin) => (
                <Card key={admin.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {admin.profile_picture ? (
                            <img src={admin.profile_picture} alt={admin.name} className="h-full w-full object-cover" />
                          ) : (
                            <AvatarFallback className="text-sm font-medium">
                              {admin.name?.charAt(0) || 'A'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{admin.name}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {admin.role}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(admin)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setSelectedAdmin(admin); setIsDeleteDialogOpen(true) }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Admin
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {selectedAdmin?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
