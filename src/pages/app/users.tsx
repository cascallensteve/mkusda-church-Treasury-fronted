'use client'

import { useState } from 'react'
import { UserCog, Plus, Search, ArrowLeft, Loader2, CheckCircle2, Eye, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { CHURCH, users as initialUsers } from '@/lib/data'

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    role: 'Treasurer',
    email: '',
    status: 'Active',
  })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'Active')
  const roles = Array.from(new Set(users.map(u => u.role)))

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newUser = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        status: formData.status,
      }
      setUsers([...users, newUser])
      setFormData({ name: '', role: 'Treasurer', email: '', status: 'Active' })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status,
    })
    setIsEditOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsLoading(true)
    setTimeout(() => {
      setUsers(users.map(u =>
        u.email === selectedUser.email ? { ...u, ...formData } : u
      ))
      setIsEditOpen(false)
      setIsLoading(false)
      setSelectedUser(null)
    }, 800)
  }

  const handleDelete = (email: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.email !== email))
    }
  }

  const handleView = (user: any) => {
    setSelectedUser(user)
    setIsViewOpen(true)
  }

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Users"
          description={`Manage system users and permissions for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users" value={String(totalUsers)} icon={UserCog} accent="primary" />
          <StatCard label="Active" value={String(activeUsers.length)} icon={UserCog} accent="emerald" />
          <StatCard label="Roles" value={String(roles.length)} icon={UserCog} accent="teal" />
          <StatCard label="Inactive" value={String(totalUsers - activeUsers.length)} icon={UserCog} accent="amber" />
        </div>

        {isFormOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsFormOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Add New User</h2>
                  <p className="text-sm text-muted-foreground">Enter the user details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Treasurer">Treasurer</SelectItem>
                        <SelectItem value="Assistant Treasurer">Assistant Treasurer</SelectItem>
                        <SelectItem value="Pastor">Pastor</SelectItem>
                        <SelectItem value="Department Leader">Department Leader</SelectItem>
                        <SelectItem value="Auditor">Auditor</SelectItem>
                        <SelectItem value="Church Administrator">Church Administrator</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Add User</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-serif">User Management</CardTitle>
                  <CardDescription>
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleView(user)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(user.email)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View User Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                    <Badge variant="secondary">{selectedUser.role}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span>{selectedUser.email}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><Badge variant="secondary" className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Treasurer">Treasurer</SelectItem>
                      <SelectItem value="Assistant Treasurer">Assistant Treasurer</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                      <SelectItem value="Department Leader">Department Leader</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Church Administrator">Church Administrator</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <footer className="border-t bg-white mt-8">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-gray-500">{CHURCH.system} • {CHURCH.location}</p>
            <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} {CHURCH.name}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
