import { FileText, FileSpreadsheet, FileDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"
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
import { reports } from "@/lib/data"

const quickReports = [
  "Monthly Treasury Report",
  "Quarterly Report",
  "Annual Financial Report",
  "Income Statement",
  "Expense Statement",
  "Cash Flow Report",
  "Fund Balances Report",
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financial Reports"
        description="Generate and export treasury reports for finance committee and auditors."
      />

      <Card>
        <CardHeader>
          <CardTitle>Generate a Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {quickReports.map((r) => (
            <Button key={r} variant="outline" size="sm" className="gap-2">
              <FileText className="size-4" />
              {r}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead className="text-right">Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.period}</TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Export PDF">
                          <FileDown className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Export Excel">
                          <FileSpreadsheet className="size-4" />
                        </Button>
                      </div>
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
