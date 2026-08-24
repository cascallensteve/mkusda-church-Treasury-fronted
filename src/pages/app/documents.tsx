'use client'

import { useState } from 'react'
import { FileText, Plus, Search, ArrowLeft, Loader2, CheckCircle2, Eye, Download, Trash2 } from 'lucide-react'

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
import { CHURCH, documents as initialDocuments } from '@/lib/data'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Bank Statements',
    date: new Date().toISOString().split('T')[0],
    size: '',
    type: 'PDF',
  })

  const totalDocuments = documents.length
  const categories = Array.from(new Set(documents.map(d => d.category)))
  const totalSize = documents.reduce((sum, d) => {
    const size = parseFloat(d.size)
    const unit = d.size.includes('MB') ? 1024 : 1
    return sum + (size * unit)
  }, 0)
  const sizeLabel = totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${Math.round(totalSize)} KB`

  const filteredDocuments = documents.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newItem = {
        name: formData.name,
        category: formData.category,
        date: formData.date,
        size: formData.size || '0 KB',
        type: formData.type,
      }
      setDocuments([newItem, ...documents])
      setFormData({ name: '', category: 'Bank Statements', date: new Date().toISOString().split('T')[0], size: '', type: 'PDF' })
      setIsFormOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'PDF': 'bg-rose-50 text-rose-700 border-rose-200',
      'XLSX': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'JPG': 'bg-blue-50 text-blue-700 border-blue-200',
      'PNG': 'bg-blue-50 text-blue-700 border-blue-200',
      'DOCX': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    }
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Documents"
          description={`Manage church financial documents and records for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Add Document
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Documents" value={String(totalDocuments)} icon={FileText} accent="primary" />
          <StatCard label="Categories" value={String(categories.length)} icon={FileText} accent="emerald" />
          <StatCard label="Total Size" value={sizeLabel} icon={FileText} accent="teal" />
          <StatCard label="Recent" value={documents.filter(d => d.date.startsWith('2026-07')).length + ' docs'} icon={FileText} accent="amber" />
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
                  <h2 className="text-lg font-semibold">Add New Document</h2>
                  <p className="text-sm text-muted-foreground">Enter the document details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Document Name *</Label>
                    <Input id="name" name="name" placeholder="e.g. June 2026 Bank Statement" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Statements">Bank Statements</SelectItem>
                        <SelectItem value="Audit Reports">Audit Reports</SelectItem>
                        <SelectItem value="Budget Documents">Budget Documents</SelectItem>
                        <SelectItem value="Financial Policies">Financial Policies</SelectItem>
                        <SelectItem value="Receipts">Receipts</SelectItem>
                        <SelectItem value="Contracts">Contracts</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">File Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                        <SelectItem value="JPG">JPG</SelectItem>
                        <SelectItem value="PNG">PNG</SelectItem>
                        <SelectItem value="DOCX">DOCX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">File Size</Label>
                    <Input id="size" name="size" placeholder="e.g. 250 KB" value={formData.size} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Save Document</>}
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
                  <CardTitle className="font-serif">Document Repository</CardTitle>
                  <CardDescription>
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search documents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc, index) => (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="secondary">{doc.category}</Badge></TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{doc.date}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getTypeColor(doc.type)}>{doc.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{doc.size}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleView(doc)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
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

        {/* View Document Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Document Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                    <Badge variant="secondary">{selectedItem.category}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">File Type</span><span>{selectedItem.type}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Size</span><span>{selectedItem.size}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date Added</span><span>{selectedItem.date}</span></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
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
