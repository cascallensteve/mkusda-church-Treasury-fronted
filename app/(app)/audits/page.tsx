import { ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auditLogs, formatKES } from "@/lib/data"

export default function AuditsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit Module"
        description="Immutable log of every financial action for transparency and review."
      />

      <Card>
        <CardHeader>
          <CardTitle>Activity & Transaction Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {auditLogs.map((log, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-accent text-primary ring-4 ring-background">
                  <ShieldCheck className="size-3.5" />
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{log.action}</p>
                  {log.amount > 0 && (
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                      {formatKES(log.amount)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {log.user} &middot; {log.time}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
