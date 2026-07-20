import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const map: Record<string, string> = {
  Active: 'bg-success/15 text-success',
  Completed: 'bg-success/15 text-success',
  Approved: 'bg-success/15 text-success',
  'In Progress': 'bg-secondary text-secondary-foreground',
  Pending: 'bg-warning/15 text-warning-foreground',
  Inactive: 'bg-muted text-muted-foreground',
  Transferred: 'bg-muted text-muted-foreground',
  Rejected: 'bg-destructive/15 text-destructive',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn('border-0 font-medium', map[status] ?? 'bg-muted text-muted-foreground')}>
      {status}
    </Badge>
  )
}
