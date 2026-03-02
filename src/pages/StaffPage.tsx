import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockStaff } from '@/data/mock';
import type { Staff } from '@/types';
import { exportToPDF, exportToXLSX } from '@/lib/export';

export default function StaffPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [form, setForm] = useState({
    firstName: '', lastName: '', role: 'teacher' as Staff['role'],
    email: '', phone: '', address: '', status: 'active' as 'active' | 'inactive',
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ firstName: '', lastName: '', role: 'teacher', email: '', phone: '', address: '', status: 'active' });
    setIsFormOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditItem(s);
    setForm({ firstName: s.firstName, lastName: s.lastName, role: s.role, email: s.email, phone: s.phone, address: s.address, status: s.status });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      setStaff(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
    } else {
      setStaff(prev => [...prev, { ...form, id: String(Date.now()), hireDate: new Date().toISOString().split('T')[0] }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const roleLabel = (r: string) => r === 'teacher' ? 'Enseignant' : r === 'admin' ? 'Administratif' : 'Support';

  const filtered = roleFilter === 'all' ? staff : staff.filter(s => s.role === roleFilter);

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Liste du personnel',
      headers: ['Nom', 'Rôle', 'Email', 'Téléphone', 'Statut'],
      rows: filtered.map(s => [`${s.lastName} ${s.firstName}`, roleLabel(s.role), s.email, s.phone, s.status === 'active' ? 'Actif' : 'Inactif']),
      filename: 'personnel',
    });
  };

  const handleExportXLSX = () => {
    exportToXLSX({
      title: 'Personnel',
      headers: ['Nom', 'Prénom', 'Rôle', 'Email', 'Téléphone', 'Statut'],
      rows: filtered.map(s => [s.lastName, s.firstName, roleLabel(s.role), s.email, s.phone, s.status]),
      filename: 'personnel',
    });
  };

  const columns = [
    { key: 'name', header: 'Nom', render: (s: Staff) => <span className="font-medium text-card-foreground">{s.lastName} {s.firstName}</span> },
    { key: 'role', header: 'Rôle', render: (s: Staff) => <Badge variant="secondary" className="text-xs">{roleLabel(s.role)}</Badge> },
    { key: 'email', header: 'Email', className: 'hidden md:table-cell' },
    { key: 'phone', header: 'Téléphone', className: 'hidden lg:table-cell' },
    { key: 'subjects', header: 'Matières', className: 'hidden lg:table-cell', render: (s: Staff) => s.subjects?.join(', ') || '—' },
    { key: 'status', header: 'Statut', render: (s: Staff) => <StatusBadge status={s.status} /> },
    {
      key: 'actions', header: '',
      render: (s: Staff) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(s); }}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(s); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Personnel" description="Gestion du personnel de l'établissement">
        <ExportButtons onPDF={handleExportPDF} onXLSX={handleExportXLSX} />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </PageHeader>

      <div className="flex gap-2">
        {['all', 'teacher', 'admin', 'support'].map(r => (
          <Button key={r} variant={roleFilter === r ? 'default' : 'outline'} size="sm" onClick={() => setRoleFilter(r)}>
            {r === 'all' ? 'Tous' : roleLabel(r)}
          </Button>
        ))}
      </div>

      <DataTable data={filtered} columns={columns} searchPlaceholder="Rechercher un membre..." searchKey="lastName" />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editItem ? 'Modifier' : 'Ajouter un membre'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Prénom</Label><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Nom</Label><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Rôle</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as Staff['role'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="teacher">Enseignant</SelectItem><SelectItem value="admin">Administratif</SelectItem><SelectItem value="support">Support</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Statut</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Actif</SelectItem><SelectItem value="inactive">Inactif</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2"><Label>Adresse</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editItem ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Supprimer le membre" description={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.firstName} ${deleteTarget?.lastName} ?`} />
    </div>
  );
}
