import { Badge } from '@/components/ui/badge'

const kindStyles: Record<string, string> = {
  warning: 'bg-warning/15 text-warning-foreground',
  danger: 'bg-destructive/15 text-destructive',
  info: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/15 text-success',
}

export function StatusBadge({ status }: { status: string }) {
  const style = kindStyles[status.toLowerCase()] || 'bg-secondary text-secondary-foreground'
  return <Badge className={`border-0 capitalize ${style}`}>{status}</Badge>
}
