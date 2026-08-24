'use client'

import { useState, useEffect } from 'react'
import { HandCoins, Plus, Search, Loader2, CheckCircle2, Edit, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { api } from '@/lib/api'

type DonationType = {
  id: number
  name: string
  description: string
  created_by: number
  created_by_email: string
  created_by_name: string
  created_at: string
}

export default function DonationTypesPage() {
  const [donationTypes, setDonationTypes] = useState<DonationType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<DonationType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const fetchDonationTypes = async () => {
    setIsLoading(true)
    try {
      const data = await api.getDonationTypes()
      setDonationTypes(data.results || data)
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Failed to load donation types')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDonationTypes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedType) {
        await api.updateDonationType(selectedType.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        })
        toast.success('Donation type updated successfully')
      } else {
        await api.createDonationType({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        })
        toast.success('Donation type created successfully')
      }
      setIsFormOpen(false)
      setSelectedType(null)
      setFormData({ name: '', description: '' })
      fetchDonationTypes()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (donationType: DonationType) => {
    setSelectedType(donationType)
    setFormData({
      name: donationType.name,
      description: donationType.description || '',
    })
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedType) return
    setIsSubmitting(true)
    try {
      await api.deleteDonationType(selectedType.id)
      toast.success('Donation type deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedType(null)
      fetchDonationTypes()
    } catch (err: any) {
      toast.error(err?.body?.detail || err?.message || 'Delete failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTypes = donationTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalTypes = donationTypes.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Types"
        description="Manage donation categories and types"
        actions={
          !isFormOpen ? (
            <Button onClick={() => { setSelectedType(null); setFormData({ name: '', description: '' }); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Donation Type
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Types" value={String(totalTypes)} icon={HandCoins} accent="primary" />
        <StatCard label="Active" value={String(totalTypes)} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Last Updated" value={donationTypes[0] ? new Date(donationTypes[0].created_at).toLocaleDateString() : 'N/A'} icon={HandCoins} accent="amber" />
      </div>

      {isFormOpen ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" onClick={() => { setIsFormOpen(false); setSelectedType(null); setFormData({ name: '', description: '' }) }} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{selectedType ? 'Edit Donation Type' : 'Add New Donation Type'}</h2>
                <p className="text-sm text-muted-foreground">{selectedType ? 'Update the donation type details below.' : 'Enter the donation type details below.'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tithes, Offerings"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description for this donation type"
                  rows={3}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setSelectedType(null); setFormData({ name: '', description: '' }) }} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {selectedType ? 'Saving...' : 'Creating...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {selectedType ? 'Save Changes' : 'Create Type'}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Donation Types</CardTitle>
                <CardDescription>View and manage donation type categories</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donation types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredTypes.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {searchTerm ? 'No donation types match your search.' : 'No donation types found. Create your first one!'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell className="text-gray-600">{type.description || '—'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{type.created_by_name}</span>
                            <span className="text-xs text-gray-500">{type.created_by_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(type.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(type)}
                              className="h-8 w-8 text-gray-600 hover:text-indigo-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedType(type); setIsDeleteDialogOpen(true) }}
                              className="h-8 w-8 text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Donation Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedType?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
