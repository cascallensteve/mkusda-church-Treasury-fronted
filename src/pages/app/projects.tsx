'use client'

import { useState } from 'react'
import { FolderKanban, Calendar, DollarSign, TrendingUp, Search, ArrowLeft, Loader2, CheckCircle2, Edit, Trash2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CHURCH, formatKES, projects as initialProjects } from '@/lib/data'

type Project = {
  name: string
  budget: number
  spent: number
  progress: number
  status: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    spent: '',
    progress: '',
    status: 'In Progress',
  })

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const activeProjects = projects.filter(p => p.status === 'In Progress').length
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500'
    if (progress >= 70) return 'bg-indigo-500'
    if (progress >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const newProject: Project = {
        name: formData.name,
        budget: Number(formData.budget) || 0,
        spent: Number(formData.spent) || 0,
        progress: Number(formData.progress) || 0,
        status: formData.status,
      }
      setProjects([...projects, newProject])
      setFormData({ name: '', budget: '', spent: '', progress: '', status: 'In Progress' })
      setIsDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      name: project.name,
      budget: String(project.budget),
      spent: String(project.spent),
      progress: String(project.progress),
      status: project.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects(projects.map(p =>
        p.name === selectedProject.name ? {
          ...p,
          name: formData.name,
          budget: Number(formData.budget) || 0,
          spent: Number(formData.spent) || 0,
          progress: Number(formData.progress) || 0,
          status: formData.status,
        } : p
      ))
      setIsEditDialogOpen(false)
      setIsLoading(false)
      setSelectedProject(null)
      setFormData({ name: '', budget: '', spent: '', progress: '', status: 'In Progress' })
    }, 800)
  }

  const handleDelete = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      setProjects(projects.filter(p => p.name !== project.name))
    }
  }

  const handleView = (project: Project) => {
    setSelectedProject(project)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-6">
        <PageHeader
          title="Projects"
          description={`Track church projects, budgets, and completion status for ${CHURCH.name}`}
          actions={
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <FolderKanban className="w-4 h-4" />
              Add Project
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Budget" value={formatKES(totalBudget, { compact: true })} icon={DollarSign} accent="primary" />
          <StatCard label="Total Spent" value={formatKES(totalSpent, { compact: true })} icon={TrendingUp} accent="amber" />
          <StatCard label="Active Projects" value={String(activeProjects)} icon={FolderKanban} accent="emerald" />
          <StatCard label="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} accent="teal" />
        </div>

        {isDialogOpen ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-lg font-semibold">Add New Project</h2>
                  <p className="text-sm text-muted-foreground">Enter the project details below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (KES) *</Label>
                    <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spent">Amount Spent (KES) *</Label>
                    <Input id="spent" name="spent" type="number" value={formData.spent} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress (%) *</Label>
                    <Input id="progress" name="progress" type="number" min="0" max="100" value={formData.progress} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><CheckCircle2 className="w-4 h-4 mr-2" />Add Project</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {filteredProjects.map((project, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                          <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">{project.name}</CardTitle>
                          <CardDescription className="text-xs">Budget: {formatKES(project.budget)}</CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="text-sm font-semibold text-gray-800">{formatKES(project.spent)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-sm font-semibold text-gray-800">{formatKES(project.budget - project.spent)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Updated recently</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="font-serif">All Projects</CardTitle>
                    <CardDescription>Complete list of church projects</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-64" />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No projects found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProjects.map((project, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{formatKES(project.budget)}</TableCell>
                            <TableCell className="text-rose-600 font-medium">{formatKES(project.spent)}</TableCell>
                            <TableCell>{formatKES(project.budget - project.spent)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
                                  <div className={`h-full rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{project.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell><StatusBadge status={project.status} /></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(project)} className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(project)} className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(project)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
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
          </>
        )}

        {/* View Project Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle>Project Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedProject.name}</h3>
                      <StatusBadge status={selectedProject.status} />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Budget</span><span className="font-medium">{formatKES(selectedProject.budget)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Spent</span><span className="font-medium text-rose-600">{formatKES(selectedProject.spent)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Remaining</span><span className="font-medium">{formatKES(selectedProject.budget - selectedProject.spent)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{selectedProject.progress}%</span></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update the project details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-name">Project Name *</Label>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget (KES) *</Label>
                  <Input id="edit-budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spent">Amount Spent (KES) *</Label>
                  <Input id="edit-spent" name="spent" type="number" value={formData.spent} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-progress">Progress (%) *</Label>
                  <Input id="edit-progress" name="progress" type="number" min="0" max="100" value={formData.progress} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
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
