import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { InvoiceStatusBadge } from '@/components/shared/InvoiceStatusBadge';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockInvoices, mockStudents, mockClasses } from '@/data/mock';
import type { Invoice, InvoiceCategory, InvoiceStatus } from '@/types';
import { formatFCFA, exportToPDF, exportToXLSX } from '@/lib/export';

const CATEGORY_LABELS: Record<InvoiceCategory, string> = {
  scolarite: 'Scolarité', inscription: 'Inscription', cantine: 'Cantine', transport: 'Transport', autre: 'Autre',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [editItem, setEditItem] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [detailItem, setDetailItem] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  const [form, setForm] = useState({
    studentId: '', classId: '', category: 'scolarite' as InvoiceCategory,
    period: '', amount: '', description: '', dueDate: '',
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ studentId: '', classId: '', category: 'scolarite', period: '', amount: '', description: '', dueDate: '' });
    setIsFormOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditItem(inv);
    setForm({
      studentId: inv.studentId, classId: inv.classId, category: inv.category,
      period: inv.period, amount: String(inv.amount), description: inv.description || '', dueDate: inv.dueDate,
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    const student = mockStudents.find(s => s.id === form.studentId);
    const cls = mockClasses.find(c => c.id === form.classId);
    const amount = Number(form.amount) || 0;
    if (editItem) {
      setInvoices(prev => prev.map(inv => inv.id === editItem.id ? {
        ...inv, ...form, amount, studentName: student ? `${student.firstName} ${student.lastName}` : inv.studentName,
        className: cls?.name || inv.className,
      } : inv));
    } else {
      const ref = `F-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
      setInvoices(prev => [...prev, {
        id: String(Date.now()), reference: ref,
        studentId: form.studentId, studentName: student ? `${student.firstName} ${student.lastName}` : '',
        classId: form.classId, className: cls?.name || '', category: form.category,
        period: form.period, amount, paidAmount: 0, status: 'unpaid' as InvoiceStatus,
        issuedDate: new Date().toISOString().split('T')[0], dueDate: form.dueDate, description: form.description,
      }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) { setInvoices(prev => prev.filter(i => i.id !== deleteTarget.id)); setDeleteTarget(null); }
  };

  const markAsPaid = (inv: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, paidAmount: i.amount, status: 'paid' as InvoiceStatus } : i));
  };

  let filtered = invoices;
  if (statusFilter !== 'all') filtered = filtered.filter(i => i.status === statusFilter);
  if (classFilter !== 'all') filtered = filtered.filter(i => i.classId === classFilter);

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Liste des factures',
      headers: ['Référence', 'Élève', 'Classe', 'Catégorie', 'Montant', 'Payé', 'Statut'],
      rows: filtered.map(i => [i.reference, i.studentName, i.className, CATEGORY_LABELS[i.category], formatFCFA(i.amount), formatFCFA(i.paidAmount), i.status === 'paid' ? 'Payée' : i.status === 'partial' ? 'Partielle' : 'Impayée']),
      filename: 'factures',
    });
  };

  const handleExportXLSX = () => {
    exportToXLSX({
      title: 'Factures',
      headers: ['Référence', 'Élève', 'Classe', 'Catégorie', 'Montant', 'Payé', 'Statut'],
      rows: filtered.map(i => [i.reference, i.studentName, i.className, CATEGORY_LABELS[i.category], String(i.amount), String(i.paidAmount), i.status]),
      filename: 'factures',
    });
  };

  const columns = [
    { key: 'reference', header: 'Réf.', render: (i: Invoice) => <span className="font-mono text-xs font-medium">{i.reference}</span> },
    { key: 'studentName', header: 'Élève', render: (i: Invoice) => <span className="font-medium text-card-foreground">{i.studentName}</span> },
    { key: 'className', header: 'Classe', className: 'hidden sm:table-cell' },
    { key: 'category', header: 'Catégorie', className: 'hidden md:table-cell', render: (i: Invoice) => CATEGORY_LABELS[i.category] },
    { key: 'amount', header: 'Montant', render: (i: Invoice) => formatFCFA(i.amount) },
    { key: 'status', header: 'Statut', render: (i: Invoice) => <InvoiceStatusBadge status={i.status} /> },
    {
      key: 'actions', header: '',
      render: (i: Invoice) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setDetailItem(i); }}><Eye className="h-4 w-4" /></Button>
          {i.status !== 'paid' && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); markAsPaid(i); }}><CheckCircle className="h-4 w-4 text-success" /></Button>}
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); openEdit(i); }}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setDeleteTarget(i); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Facturation" description="Gestion des factures scolaires">
        <ExportButtons onPDF={handleExportPDF} onXLSX={handleExportXLSX} />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Nouvelle facture</Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {['all', 'paid', 'partial', 'unpaid'].map(s => (
          <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'Toutes' : s === 'paid' ? 'Payées' : s === 'partial' ? 'Partielles' : 'Impayées'}
          </Button>
        ))}
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Classe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {mockClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} searchPlaceholder="Rechercher une facture..." searchKey="studentName" />

      {/* Detail dialog */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Détail Facture</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-foreground">AchScholar</p>
                  <p className="text-muted-foreground">Lomé, Togo</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">{detailItem.reference}</p>
                  <InvoiceStatusBadge status={detailItem.status} />
                </div>
              </div>
              <div className="border-t pt-3 grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Élève</p><p className="font-medium">{detailItem.studentName}</p></div>
                <div><p className="text-muted-foreground">Classe</p><p className="font-medium">{detailItem.className}</p></div>
                <div><p className="text-muted-foreground">Catégorie</p><p className="font-medium">{CATEGORY_LABELS[detailItem.category]}</p></div>
                <div><p className="text-muted-foreground">Période</p><p className="font-medium">{detailItem.period}</p></div>
                <div><p className="text-muted-foreground">Date d'émission</p><p className="font-medium">{new Date(detailItem.issuedDate).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-muted-foreground">Date limite</p><p className="font-medium">{new Date(detailItem.dueDate).toLocaleDateString('fr-FR')}</p></div>
              </div>
              {detailItem.description && <div className="border-t pt-3"><p className="text-muted-foreground">Description</p><p>{detailItem.description}</p></div>}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Montant total</span><span className="font-bold text-lg">{formatFCFA(detailItem.amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Montant payé</span><span className="font-medium text-success">{formatFCFA(detailItem.paidAmount)}</span></div>
                {detailItem.amount - detailItem.paidAmount > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Reste à payer</span><span className="font-medium text-destructive">{formatFCFA(detailItem.amount - detailItem.paidAmount)}</span></div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Form dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editItem ? 'Modifier la facture' : 'Nouvelle facture'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={form.studentId} onValueChange={v => {
                const s = mockStudents.find(st => st.id === v);
                setForm({ ...form, studentId: v, classId: s?.classId || form.classId });
              }}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{mockStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.lastName} {s.firstName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={form.classId} onValueChange={v => setForm({ ...form, classId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{mockClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v as InvoiceCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Input placeholder="Ex: Trimestre 1" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Montant (FCFA)</Label>
              <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date limite</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editItem ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Supprimer la facture" description={`Supprimer la facture ${deleteTarget?.reference} ?`} />
    </div>
  );
}
