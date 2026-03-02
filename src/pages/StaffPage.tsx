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

const ROLE_LABELS: Record<string, string> = {
  teacher: 'Enseignant',
  admin: 'Administratif',
  support: 'Support',
};

const roleLabel = (r: string) => ROLE_LABELS[r] ?? r;

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  role: 'teacher' as Staff['role'],
  email: '',
  phone: '',
  address: '',
  status: 'active' as 'active' | 'inactive',
};

export default function StaffPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditItem(s);
    setForm({
      firstName: s.firstName,
      lastName: s.lastName,
      role: s.role,
      email: s.email,
      phone: s.phone,
      address: s.address,
      status: s.status,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError('Le prénom et le nom sont obligatoires.');
      return;
    }
    if (!form.email.trim()) {
      setFormError("L'adresse email est obligatoire.");
      return;
    }
    setFormError('');
    if (editItem) {
      setStaff(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
    } else {
      setStaff(prev => [
        ...prev,
        { ...form, id: String(Date.now()), hireDate: new Date().toISOString().split('T')[0] },
      ]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered = roleFilter === 'all' ? staff : staff.filter(s => s.role === roleFilter);

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Liste du personnel',
      headers: ['Nom', 'Rôle', 'Email', 'Téléphone', 'Statut'],
      rows: filtered.map(s => [
        `${s.lastName} ${s.firstName}`,
        roleLabel(s.role),
        s.email,
        s.phone,
        s.status === 'active' ? 'Actif' : 'Inactif',
      ]),
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
    {
      key: 'name',
      header: 'Nom',
      render: (s: Staff) => (
        <span className="font-medium text-card-foreground">{s.lastName} {s.firstName}</span>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (s: Staff) => (
        <Badge variant="secondary" className="text-xs">{roleLabel(s.role)}</Badge>
      ),
    },
    { key: 'email', header: 'Email', className: 'hidden md:table-cell' },
    { key: 'phone', header: 'Téléphone', className: 'hidden lg:table-cell' },
    {
      key: 'subjects',
      header: 'Matières',
      className: 'hidden lg:table-cell',
      render: (s: Staff) => s.subjects?.join(', ') || '—',
    },
    {
      key: 'status',
      header: 'Statut',
      render: (s: Staff) => <StatusBadge status={s.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (s: Staff) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(s); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(s); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'teacher', 'admin', 'support'] as const).map(r => (
          <Button
            key={r}
            variant={roleFilter === r ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(r)}
          >
            {r === 'all' ? 'Tous' : ROLE_LABELS[r]}
          </Button>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Rechercher un membre..."
        searchKey="lastName"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prénom <span className="text-destructive">*</span></Label>
              <Input
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                placeholder="Jean"
              />
            </div>
            <div className="space-y-2">
              <Label>Nom <span className="text-destructive">*</span></Label>
              <Input
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                placeholder="Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as Staff['role'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Enseignant</SelectItem>
                  <SelectItem value="admin">Administratif</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="jean.dupont@ecole.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+XX XX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Adresse</Label>
              <Input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Adresse complète"
              />
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editItem ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le membre"
        description={`Voulez-vous vraiment supprimer ${deleteTarget?.firstName} ${deleteTarget?.lastName} ?`}
      />
    </div>
  );
}
