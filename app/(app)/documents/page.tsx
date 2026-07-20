import { FileText, FileImage, FileSpreadsheet, Upload, Download } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { documents } from "@/lib/data"

function iconFor(type: string) {
  if (type === "JPG" || type === "PNG") return FileImage
  if (type === "XLSX" || type === "CSV") return FileSpreadsheet
  return FileText
}

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Document Management"
        description="Store receipts, bank statements, audit reports and financial policies."
      >
        <Button className="gap-2">
          <Upload className="size-4" />
          Upload Document
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const Icon = iconFor(doc.type)
          return (
            <Card key={doc.name}>
              <CardHeader className="flex-row items-start gap-3 space-y-0 pb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-sm leading-tight">{doc.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1.5">
                    {doc.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <p className="text-xs text-muted-foreground">
                  {doc.type} &middot; {doc.size} &middot; {doc.date}
                </p>
                <Button variant="ghost" size="icon" aria-label={`Download ${doc.name}`}>
                  <Download className="size-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
