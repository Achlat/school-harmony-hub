import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { InvoiceStatusBadge } from '@/components/shared/InvoiceStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPayments, mockClasses } from '@/data/mock';
import type { Payment } from '@/types';
import { formatFCFA, exportToPDF, exportToXLSX } from '@/lib/export';

const METHOD_LABELS: Record<string, string> = {
  cash: 'Espèces', mobile_money: 'Mobile Money', bank: 'Virement', cheque: 'Chèque',
};

export default function PaymentsPage() {
  const [classFilter, setClassFilter] = useState('all');

  const filtered = classFilter === 'all' ? mockPayments : mockPayments.filter(p => {
    const cls = mockClasses.find(c => c.name === p.className);
    return cls?.id === classFilter;
  });

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Historique des paiements',
      headers: ['Date', 'Facture', 'Élève', 'Classe', 'Montant', 'Méthode'],
      rows: filtered.map(p => [new Date(p.date).toLocaleDateString('fr-FR'), p.invoiceRef, p.studentName, p.className, formatFCFA(p.amount), METHOD_LABELS[p.method]]),
      filename: 'paiements',
    });
  };

  const handleExportXLSX = () => {
    exportToXLSX({
      title: 'Paiements',
      headers: ['Date', 'Facture', 'Élève', 'Classe', 'Montant', 'Méthode'],
      rows: filtered.map(p => [p.date, p.invoiceRef, p.studentName, p.className, String(p.amount), p.method]),
      filename: 'paiements',
    });
  };

  const columns = [
    { key: 'date', header: 'Date', render: (p: Payment) => new Date(p.date).toLocaleDateString('fr-FR') },
    { key: 'invoiceRef', header: 'Facture', render: (p: Payment) => <span className="font-mono text-xs">{p.invoiceRef}</span> },
    { key: 'studentName', header: 'Élève', render: (p: Payment) => <span className="font-medium text-card-foreground">{p.studentName}</span> },
    { key: 'className', header: 'Classe', className: 'hidden sm:table-cell' },
    { key: 'amount', header: 'Montant', render: (p: Payment) => <span className="font-semibold">{formatFCFA(p.amount)}</span> },
    {
      key: 'method', header: 'Méthode', className: 'hidden md:table-cell',
      render: (p: Payment) => <Badge variant="secondary" className="text-xs">{METHOD_LABELS[p.method]}</Badge>,
    },
    { key: 'note', header: 'Note', className: 'hidden lg:table-cell', render: (p: Payment) => p.note || '—' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Paiements" description="Historique des paiements enregistrés">
        <ExportButtons onPDF={handleExportPDF} onXLSX={handleExportXLSX} />
      </PageHeader>

      <div className="flex gap-2">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Classe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {mockClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} searchPlaceholder="Rechercher un paiement..." searchKey="studentName" />
    </div>
  );
}
