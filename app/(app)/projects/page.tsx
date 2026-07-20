import { HardHat, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { projects, formatKES } from "@/lib/data"

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Project Management"
        description="Monitor budget allocation, spending and progress for church projects."
      >
        <Button className="gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p) => {
          const remaining = p.budget - p.spent
          return (
            <Card key={p.name}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <HardHat className="size-5" />
                    </div>
                    <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium tabular-nums">{formatKES(p.budget, { compact: true })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="text-sm font-medium tabular-nums text-destructive">
                      {formatKES(p.spent, { compact: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatKES(remaining, { compact: true })}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
