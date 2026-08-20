'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Download, 
  Eye,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Clock
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { CHURCH, formatKES } from '@/lib/data'

// Sample members data
const initialMembers = [
  {
    id: 1,
    name: 'John Mwangi',
    email: 'john.mwangi@example.com',
    phone: '+254 712 345 678',
    address: 'Nairobi, Kenya',
    membershipType: 'Active Member',
    joinDate: '2020-01-15',
    department: 'Worship',
    status: 'active',
    givingTotal: 125000,
    lastGiving: '2026-08-20',
    notes: 'Regular tithe payer, worship team member'
  },
  {
    id: 2,
    name: 'Mary Wanjiru',
    email: 'mary.wanjiru@example.com',
    phone: '+254 723 456 789',
    address: 'Kiambu, Kenya',
    membershipType: 'Active Member',
    joinDate: '2019-06-20',
    department: 'Women Ministry',
    status: 'active',
    givingTotal: 85000,
    lastGiving: '2026-08-19',
    notes: 'Active in women ministry'
  },
  {
    id: 3,
    name: 'Peter Ochieng',
    email: 'peter.ochieng@example.com',
    phone: '+254 734 567 890',
    address: 'Nakuru, Kenya',
    membershipType: 'Associate Member',
    joinDate: '2021-03-10',
    department: 'Youth',
    status: 'active',
    givingTotal: 45000,
    lastGiving: '2026-08-18',
    notes: 'Youth leader'
  },
  {
    id: 4,
    name: 'Sarah Akinyi',
    email: 'sarah.akinyi@example.com',
    phone: '+254 745 678 901',
    address: 'Kisumu, Kenya',
    membershipType: 'Active Member',
    joinDate: '2018-09-05',
    department: 'Ushering',
    status: 'active',
    givingTotal: 92000,
    lastGiving: '2026-08-17',
    notes: 'Ushering team coordinator'
  },
  {
    id: 5,
    name: 'David Kiprop',
    email: 'david.kiprop@example.com',
    phone: '+254 756 789 012',
    address: 'Eldoret, Kenya',
    membershipType: 'New Member',
    joinDate: '2025-11-01',
    department: 'Men Ministry',
    status: 'pending',
    givingTotal: 15000,
    lastGiving: '2026-08-16',
    notes: 'New member'
  },
  {
    id: 6,
    name: 'Grace Muthoni',
    email: 'grace.muthoni@example.com',
    phone: '+254 767 890 123',
    address: 'Nairobi, Kenya',
    membershipType: 'Active Member',
    joinDate: '2017-04-18',
    department: 'Intercessory',
    status: 'active',
    givingTotal: 150000,
    lastGiving: '2026-08-15',
    notes: 'Prayer warrior'
  }
]

const membershipTypes = ['Active Member', 'Associate Member', 'New Member', 'Visiting Member']
const departments = ['Worship', 'Women Ministry', 'Youth', 'Ushering', 'Men Ministry', 'Intercessory', 'Technical', 'Hospitality']
const statuses = ['active', 'inactive', 'pending']

export default function MembersPage() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(initialMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: 'Active Member',
    department: 'Worship',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: ''
  })

  // Calculate statistics
  const totalMembers = members.length
  const activeMembers = members.filter(m => m.status === 'active')
  const pendingMembers = members.filter(m => m.status === 'pending')
  const totalGiving = members.reduce((sum, m) => sum + m.givingTotal, 0)

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone.includes(searchTerm)
    const matchesType = selectedType === 'all' || member.membershipType === selectedType
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus
    return matchesSearch && matchesType && matchesDepartment && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const newMember = {
        id: members.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || 'N/A',
        membershipType: formData.membershipType,
        department: formData.department,
        joinDate: formData.joinDate,
        status: formData.status as 'active' | 'inactive' | 'pending',
        givingTotal: 0,
        lastGiving: '',
        notes: formData.notes || ''
      }

      setMembers([newMember, ...members])
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        membershipType: 'Active Member',
        department: 'Worship',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: ''
      })
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleEdit = (member: any) => {
    setSelectedMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      membershipType: member.membershipType,
      department: member.department,
      joinDate: member.joinDate,
      status: member.status,
      notes: member.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? {
          ...m,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          membershipType: formData.membershipType,
          department: formData.department,
          joinDate: formData.joinDate,
          status: formData.status as 'active' | 'inactive' | 'pending',
          notes: formData.notes || ''
        } : m
      )
      setMembers(updatedMembers)
      setIsEditDialogOpen(false)
      setIsLoading(false)
      setSelectedMember(null)
    }, 1000)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id))
    }
  }

  const handleViewMember = (member: any) => {
    setSelectedMember(member)
    setIsViewDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-amber-100 text-amber-700'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600'
    ]
    const index = name.length % colors.length
    return colors[index]
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
              <h1 className="text-lg font-bold text-gray-800">Members</h1>
              <p className="text-xs text-gray-500">Manage church members</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  Enter the member's details below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Nairobi, Kenya"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="membershipType">Membership Type</Label>
                    <Select
                      value={formData.membershipType}
                      onValueChange={(value) => handleSelectChange('membershipType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {membershipTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Add Member
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{activeMembers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{pendingMembers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">Total Giving</p>
              <p className="text-2xl font-bold text-blue-600">{formatKES(totalGiving, { compact: true })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-0 shadow-sm"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white border-0 shadow-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {membershipTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white border-0 shadow-sm">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[130px] bg-white border-0 shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Members Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Member Records</CardTitle>
                <CardDescription>
                  {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={getRandomColor(member.name)}>
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-400 hidden sm:block">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm">{member.phone}</p>
                          <p className="text-xs text-gray-400">{member.address}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {member.membershipType}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {member.department}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(member.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMember(member)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(member)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(member.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
      </main>

      {/* View Member Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle>Member Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className={`${getRandomColor(selectedMember.name)} text-lg`}>
                      {getInitials(selectedMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{selectedMember.name}</h3>
                    <p className="text-sm text-gray-500">{selectedMember.membershipType}</p>
                    {getStatusBadge(selectedMember.status)}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span>{selectedMember.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address</span>
                    <span>{selectedMember.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department</span>
                    <span>{selectedMember.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Join Date</span>
                    <span>{selectedMember.joinDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Giving</span>
                    <span className="font-bold text-blue-600">{formatKES(selectedMember.givingTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Giving</span>
                    <span>{selectedMember.lastGiving || 'N/A'}</span>
                  </div>
                </div>

                {selectedMember.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="text-sm mt-1">{selectedMember.notes}</p>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member's details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-membershipType">Membership Type</Label>
                <Select
                  value={formData.membershipType}
                  onValueChange={(value) => handleSelectChange('membershipType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-joinDate">Join Date</Label>
                <Input
                  id="edit-joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Update Member
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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