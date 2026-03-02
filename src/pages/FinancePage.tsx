import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { Banknote, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { mockInvoices, mockClasses, monthlyFinance } from '@/data/mock';
import { formatFCFA, exportToPDF, exportToXLSX } from '@/lib/export';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function FinancePage() {
  const totalInvoiced = mockInvoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = mockInvoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalUnpaid = totalInvoiced - totalCollected;
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const classSummary = mockClasses.map(cls => {
    const classInvoices = mockInvoices.filter(i => i.classId === cls.id);
    const expected = classInvoices.reduce((s, i) => s + i.amount, 0);
    const received = classInvoices.reduce((s, i) => s + i.paidAmount, 0);
    return { ...cls, expected, received, unpaid: expected - received };
  });

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Rapport financier',
      headers: ['Classe', 'Montant attendu', 'Montant reçu', 'Impayé'],
      rows: classSummary.map(c => [c.name, formatFCFA(c.expected), formatFCFA(c.received), formatFCFA(c.unpaid)]),
      filename: 'rapport-financier',
    });
  };

  const handleExportXLSX = () => {
    exportToXLSX({
      title: 'Finance',
      headers: ['Classe', 'Montant attendu', 'Montant reçu', 'Impayé'],
      rows: classSummary.map(c => [c.name, String(c.expected), String(c.received), String(c.unpaid)]),
      filename: 'rapport-financier',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Finance" description="Vue d'ensemble financière de l'établissement">
        <ExportButtons onPDF={handleExportPDF} onXLSX={handleExportXLSX} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total facturé" value={formatFCFA(totalInvoiced)} icon={Banknote} iconClassName="bg-primary/10 text-primary" />
        <StatsCard title="Total encaissé" value={formatFCFA(totalCollected)} icon={TrendingUp} iconClassName="bg-success/10 text-success" />
        <StatsCard title="Total impayé" value={formatFCFA(totalUnpaid)} icon={TrendingDown} iconClassName="bg-destructive/10 text-destructive" />
        <StatsCard title="Taux de recouvrement" value={`${collectionRate}%`} icon={Wallet} iconClassName="bg-warning/10 text-warning" />
      </div>

      {/* Monthly chart */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Évolution mensuelle (FCFA)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => formatFCFA(v)} contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 15%, 90%)', borderRadius: '8px', fontSize: '13px' }} />
            <Legend />
            <Bar dataKey="invoiced" name="Facturé" fill="hsl(220, 65%, 38%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="collected" name="Encaissé" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-class breakdown */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Vue par classe</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Classe</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Attendu</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Reçu</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Impayé</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">%</th>
              </tr>
            </thead>
            <tbody>
              {classSummary.map(c => {
                const pct = c.expected > 0 ? Math.round((c.received / c.expected) * 100) : 0;
                return (
                  <tr key={c.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-right">{formatFCFA(c.expected)}</td>
                    <td className="px-4 py-3 text-right text-success">{formatFCFA(c.received)}</td>
                    <td className="px-4 py-3 text-right text-destructive">{formatFCFA(c.unpaid)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
