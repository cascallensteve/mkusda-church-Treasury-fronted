'use client'

import { useMemo, useState } from 'react'
import { Search, UserPlus, Users } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { members as seed, type MemberStatus } from '@/lib/data'

type Member = (typeof seed)[number]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

export default function MembersPage() {
  const [list, setList] = useState<Member[]>(seed)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', department: '', family: '' })

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return list
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q),
    )
  }, [list, query])

  function addMember() {
    if (!form.name.trim()) return
    const next: Member = {
      id: `MK-${(152 + list.length).toString().padStart(4, '0')}`,
      name: form.name,
      phone: form.phone || '—',
      email: form.email || '—',
      department: form.department || 'General',
      baptismDate: new Date().toISOString().slice(0, 10),
      status: 'Active' as MemberStatus,
      family: form.family || `${form.name.split(' ').slice(-1)} Family`,
    }
    setList((prev) => [next, ...prev])
    setForm({ name: '', phone: '', email: '', department: '', family: '' })
    setOpen(false)
  }

  const active = list.filter((m) => m.status === 'Active').length

  return (
    <>
      <PageHeader
        title="Member Management"
        description="Comprehensive church member database and contribution profiles."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><UserPlus className="size-4" />Add Member</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Register a new member into the MKUSDA database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mary Wanjiru" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7.." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dept">Department</Label>
                    <Input id="dept" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Youth" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@mkusda.org" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="family">Family Group</Label>
                  <Input id="family" value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })} placeholder="e.g. Wanjiru Family" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button onClick={addMember}>Save Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Members</p>
              <p className="font-serif text-xl font-bold">{list.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="font-serif text-xl font-bold">{active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Departments</p>
              <p className="font-serif text-xl font-bold">{new Set(list.map((m) => m.department)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, ID or department"
                className="pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Baptism Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                            {initials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{m.id}</TableCell>
                    <TableCell>{m.department}</TableCell>
                    <TableCell className="text-muted-foreground">{m.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{m.baptismDate}</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No members match your search.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
