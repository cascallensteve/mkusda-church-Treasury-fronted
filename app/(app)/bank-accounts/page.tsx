import { Landmark, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { bankAccounts, bankTransactions, formatKES } from "@/lib/data"

export default function BankAccountsPage() {
  const totalBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bank Accounts"
        description="Manage church bank accounts, deposits, withdrawals and reconciliation."
      >
        <Button className="gap-2">
          <Landmark className="size-4" />
          Add Account
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((acc) => (
          <Card key={acc.id} className="overflow-hidden">
            <div className="h-1.5 bg-primary" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Landmark className="size-5" />
                </div>
                <Badge variant="secondary">{acc.branch}</Badge>
              </div>
              <CardTitle className="pt-2 text-base">{acc.bank}</CardTitle>
              <p className="font-mono text-sm text-muted-foreground">{acc.accountNumber}</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">{formatKES(acc.balance)}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                  <ArrowDownLeft className="size-3.5" />
                  Deposit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                  <ArrowUpRight className="size-3.5" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="flex flex-col justify-center bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Total Across All Accounts</p>
            <p className="text-3xl font-semibold tabular-nums">{formatKES(totalBalance)}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 gap-1.5 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <ArrowLeftRight className="size-3.5" />
              Transfer Between Accounts
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell className="text-muted-foreground">{t.account}</TableCell>
                    <TableCell>
                      <span
                        className={
                          t.type === "Deposit"
                            ? "inline-flex items-center gap-1 text-success"
                            : "inline-flex items-center gap-1 text-destructive"
                        }
                      >
                        {t.type === "Deposit" ? (
                          <ArrowDownLeft className="size-3.5" />
                        ) : (
                          <ArrowUpRight className="size-3.5" />
                        )}
                        {t.type}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium tabular-nums ${
                        t.type === "Deposit" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {t.type === "Deposit" ? "+" : "-"}
                      {formatKES(t.amount)}
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
