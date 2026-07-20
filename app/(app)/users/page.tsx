import { UserPlus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { users } from "@/lib/data"

const roles = [
  { role: "Treasurer", access: "Full treasury access" },
  { role: "Assistant Treasurer", access: "Limited treasury access" },
  { role: "Pastor", access: "View financial reports" },
  { role: "Department Leader", access: "Department-only access" },
  { role: "Auditor", access: "Audit and review access" },
  { role: "Church Administrator", access: "Full system access" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users & Roles"
        description="Manage who can access the treasury system and what they can do."
      >
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Add User
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.role} className="rounded-lg border border-border bg-card p-4">
              <p className="font-medium text-foreground">{r.role}</p>
              <p className="text-sm text-muted-foreground">{r.access}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-accent text-xs text-primary">
                            {initials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={u.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
