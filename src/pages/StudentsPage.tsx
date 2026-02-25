import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClasses, mockStudents } from '@/data/mock';
import type { Student, SchoolClass } from '@/types';

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [students, setStudents] = useState(mockStudents);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: 'M' as 'M' | 'F',
    classId: '', address: '', phone: '', email: '',
    emergencyContactName: '', emergencyContactPhone: '', status: 'active' as 'active' | 'inactive',
  });

  const openAdd = () => {
    setEditStudent(null);
    setForm({
      firstName: '', lastName: '', dateOfBirth: '', gender: 'M',
      classId: selectedClass?.id || '', address: '', phone: '', email: '',
      emergencyContactName: '', emergencyContactPhone: '', status: 'active',
    });
    setIsFormOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditStudent(s);
    setForm({
      firstName: s.firstName, lastName: s.lastName, dateOfBirth: s.dateOfBirth, gender: s.gender,
      classId: s.classId, address: s.address, phone: s.phone, email: s.email || '',
      emergencyContactName: s.emergencyContactName, emergencyContactPhone: s.emergencyContactPhone, status: s.status,
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editStudent) {
      setStudents(prev => prev.map(s => s.id === editStudent.id ? {
        ...s, ...form,
        className: mockClasses.find(c => c.id === form.classId)?.name,
      } : s));
    } else {
      const newStudent: Student = {
        ...form,
        id: String(Date.now()),
        className: mockClasses.find(c => c.id === form.classId)?.name,
        enrollmentDate: new Date().toISOString().split('T')[0],
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filteredStudents = selectedClass
    ? students.filter(s => s.classId === selectedClass.id)
    : students;

  const columns = [
    {
      key: 'name', header: 'Nom complet',
      render: (s: Student) => (
        <span className="font-medium text-card-foreground">{s.lastName} {s.firstName}</span>
      ),
    },
    { key: 'className', header: 'Classe' },
    { key: 'dateOfBirth', header: 'Date de naissance', className: 'hidden sm:table-cell' },
    { key: 'phone', header: 'Téléphone', className: 'hidden md:table-cell' },
    {
      key: 'status', header: 'Statut',
      render: (s: Student) => <StatusBadge status={s.status} />,
    },
    {
      key: 'actions', header: '',
      render: (s: Student) => (
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

  // Class list view
  if (!selectedClass) {
    return (
      <div className="space-y-6">
        <PageHeader title="Étudiants" description="Gestion des classes et des élèves">
          <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter un élève</Button>
        </PageHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockClasses.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all text-left group animate-fade-in"
            >
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{cls.studentCount} élèves • {cls.mainTeacher}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Student list for selected class
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Retour
        </Button>
      </div>
      <PageHeader title={selectedClass.name} description={`${filteredStudents.length} élèves • ${selectedClass.mainTeacher}`}>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </PageHeader>

      <DataTable
        data={filteredStudents}
        columns={columns}
        searchPlaceholder="Rechercher un élève..."
        searchKey="lastName"
      />

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editStudent ? 'Modifier l\'élève' : 'Ajouter un élève'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v as 'M' | 'F' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={form.classId} onValueChange={v => setForm({ ...form, classId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {mockClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Adresse</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact d'urgence</Label>
              <Input value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} placeholder="Nom" />
            </div>
            <div className="space-y-2">
              <Label>Tél. urgence</Label>
              <Input value={form.emergencyContactPhone} onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} />
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
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editStudent ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer l'élève"
        description={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.firstName} ${deleteTarget?.lastName} ?`}
      />
    </div>
  );
}
