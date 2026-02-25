import { useState } from 'react';
import {
  Plus, Edit, Trash2, Users, BookOpen,
  ChevronRight, ArrowLeft, GraduationCap,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { mockClasses, mockStudents } from '@/data/mock';
import type { SchoolClass, Student } from '@/types';

const LEVELS = ['6ème', '5ème', '4ème', '3ème'];

const EMPTY_CLASS_FORM = { name: '', level: '6ème', mainTeacher: '' };

const EMPTY_STUDENT_FORM = {
  firstName: '', lastName: '', dateOfBirth: '', gender: 'M' as 'M' | 'F',
  classId: '', address: '', phone: '', email: '',
  emergencyContactName: '', emergencyContactPhone: '',
  status: 'active' as 'active' | 'inactive',
};

export default function ClassesPage() {
  // ── Données principales ────────────────────────────────────────────────────
  const [classes, setClasses] = useState<SchoolClass[]>(mockClasses);
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [levelFilter, setLevelFilter] = useState('all');

  // ── Dialogs classes ────────────────────────────────────────────────────────
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [editClass, setEditClass] = useState<SchoolClass | null>(null);
  const [deleteClassTarget, setDeleteClassTarget] = useState<SchoolClass | null>(null);
  const [classForm, setClassForm] = useState(EMPTY_CLASS_FORM);

  // ── Dialogs étudiants ──────────────────────────────────────────────────────
  const [studentFormOpen, setStudentFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudentTarget, setDeleteStudentTarget] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT_FORM);

  // ── Données calculées ──────────────────────────────────────────────────────
  const enrichedClasses = classes.map(c => ({
    ...c,
    studentCount: students.filter(s => s.classId === c.id).length,
  }));

  const filteredClasses = levelFilter === 'all'
    ? enrichedClasses
    : enrichedClasses.filter(c => c.level === levelFilter);

  const classStudents = selectedClass
    ? students.filter(s => s.classId === selectedClass.id)
    : [];

  const currentEnriched = selectedClass
    ? (enrichedClasses.find(c => c.id === selectedClass.id) ?? selectedClass)
    : null;

  // ── Handlers : Classes ─────────────────────────────────────────────────────
  const openAddClass = () => {
    setEditClass(null);
    setClassForm(EMPTY_CLASS_FORM);
    setClassFormOpen(true);
  };

  const openEditClass = (c: SchoolClass) => {
    setEditClass(c);
    setClassForm({ name: c.name, level: c.level, mainTeacher: c.mainTeacher ?? '' });
    setClassFormOpen(true);
  };

  const handleSaveClass = () => {
    if (!classForm.name.trim()) return;
    if (editClass) {
      setClasses(prev => prev.map(c => c.id === editClass.id ? { ...c, ...classForm } : c));
      if (selectedClass?.id === editClass.id) {
        setSelectedClass(prev => prev ? { ...prev, ...classForm } : prev);
      }
    } else {
      setClasses(prev => [
        ...prev,
        { id: String(Date.now()), ...classForm, studentCount: 0 },
      ]);
    }
    setClassFormOpen(false);
  };

  const handleDeleteClass = () => {
    if (!deleteClassTarget) return;
    setClasses(prev => prev.filter(c => c.id !== deleteClassTarget.id));
    setStudents(prev => prev.filter(s => s.classId !== deleteClassTarget.id));
    if (selectedClass?.id === deleteClassTarget.id) setSelectedClass(null);
    setDeleteClassTarget(null);
  };

  // ── Handlers : Étudiants ───────────────────────────────────────────────────
  const openAddStudent = () => {
    setEditStudent(null);
    setStudentForm({ ...EMPTY_STUDENT_FORM, classId: selectedClass?.id ?? '' });
    setStudentFormOpen(true);
  };

  const openEditStudent = (s: Student) => {
    setEditStudent(s);
    setStudentForm({
      firstName: s.firstName, lastName: s.lastName,
      dateOfBirth: s.dateOfBirth, gender: s.gender,
      classId: s.classId, address: s.address,
      phone: s.phone, email: s.email ?? '',
      emergencyContactName: s.emergencyContactName,
      emergencyContactPhone: s.emergencyContactPhone,
      status: s.status,
    });
    setStudentFormOpen(true);
  };

  const handleSaveStudent = () => {
    const className = classes.find(c => c.id === studentForm.classId)?.name;
    if (editStudent) {
      setStudents(prev => prev.map(s =>
        s.id === editStudent.id
          ? { ...s, ...studentForm, email: studentForm.email || undefined, className }
          : s
      ));
    } else {
      setStudents(prev => [
        ...prev,
        {
          ...studentForm,
          id: String(Date.now()),
          email: studentForm.email || undefined,
          className,
          enrollmentDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setStudentFormOpen(false);
  };

  const handleDeleteStudent = () => {
    if (!deleteStudentTarget) return;
    setStudents(prev => prev.filter(s => s.id !== deleteStudentTarget.id));
    setDeleteStudentTarget(null);
  };

  const studentFormValid =
    studentForm.firstName.trim() !== '' &&
    studentForm.lastName.trim() !== '' &&
    studentForm.classId !== '' &&
    studentForm.phone.trim() !== '';

  // ── Colonnes tableau étudiants ─────────────────────────────────────────────
  const studentColumns = [
    {
      key: 'name', header: 'Nom complet',
      render: (s: Student) => (
        <span className="font-medium text-card-foreground">
          {s.lastName} {s.firstName}
        </span>
      ),
    },
    {
      key: 'gender', header: 'Genre', className: 'hidden sm:table-cell',
      render: (s: Student) => (
        <Badge variant="outline" className="text-xs">
          {s.gender === 'M' ? 'Masculin' : 'Féminin'}
        </Badge>
      ),
    },
    { key: 'dateOfBirth', header: 'Naissance', className: 'hidden md:table-cell' },
    { key: 'phone', header: 'Téléphone', className: 'hidden lg:table-cell' },
    {
      key: 'status', header: 'Statut',
      render: (s: Student) => <StatusBadge status={s.status} />,
    },
    {
      key: 'actions', header: '',
      render: (s: Student) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost" size="sm"
            onClick={e => { e.stopPropagation(); openEditStudent(s); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={e => { e.stopPropagation(); setDeleteStudentTarget(s); }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // VUE ÉTUDIANTS : liste des élèves d'une classe
  // ══════════════════════════════════════════════════════════════════════════
  if (selectedClass && currentEnriched) {
    const activeCount = classStudents.filter(s => s.status === 'active').length;
    const inactiveCount = classStudents.filter(s => s.status === 'inactive').length;

    return (
      <div className="space-y-6">
        {/* Retour */}
        <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux classes
        </Button>

        <PageHeader
          title={currentEnriched.name}
          description={
            currentEnriched.mainTeacher
              ? `Prof. principal : ${currentEnriched.mainTeacher}`
              : 'Aucun professeur principal assigné'
          }
        >
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => openEditClass(selectedClass)}>
              <Edit className="mr-1 h-4 w-4" />
              Modifier la classe
            </Button>
            <Button onClick={openAddStudent}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un élève
            </Button>
          </div>
        </PageHeader>

        {/* Résumé */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium">
            <Users className="h-4 w-4 text-primary" />
            {currentEnriched.studentCount} élève{currentEnriched.studentCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {activeCount} actif{activeCount !== 1 ? 's' : ''}
          </div>
          {inactiveCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              {inactiveCount} inactif{inactiveCount !== 1 ? 's' : ''}
            </div>
          )}
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-sm">
            <GraduationCap className="h-3.5 w-3.5" />
            {currentEnriched.level}
          </Badge>
        </div>

        {/* Tableau */}
        <DataTable
          data={classStudents}
          columns={studentColumns}
          searchPlaceholder="Rechercher un élève..."
          searchKey="lastName"
          emptyMessage="Aucun élève dans cette classe. Cliquez sur « Ajouter un élève » pour commencer."
        />

        {/* Dialog élève */}
        <Dialog open={studentFormOpen} onOpenChange={setStudentFormOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editStudent ? "Modifier l'élève" : 'Ajouter un élève'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Prénom *</Label>
                <Input
                  placeholder="Prénom"
                  value={studentForm.firstName}
                  onChange={e => setStudentForm({ ...studentForm, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  placeholder="Nom de famille"
                  value={studentForm.lastName}
                  onChange={e => setStudentForm({ ...studentForm, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={studentForm.dateOfBirth}
                  onChange={e => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Genre</Label>
                <Select
                  value={studentForm.gender}
                  onValueChange={v => setStudentForm({ ...studentForm, gender: v as 'M' | 'F' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select
                  value={studentForm.classId}
                  onValueChange={v => setStudentForm({ ...studentForm, classId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Téléphone *</Label>
                <Input
                  placeholder="+225 07 XX XX XX"
                  value={studentForm.phone}
                  onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Adresse</Label>
                <Input
                  placeholder="Adresse complète"
                  value={studentForm.address}
                  onChange={e => setStudentForm({ ...studentForm, address: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact d'urgence</Label>
                <Input
                  placeholder="Nom du contact"
                  value={studentForm.emergencyContactName}
                  onChange={e => setStudentForm({ ...studentForm, emergencyContactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tél. urgence</Label>
                <Input
                  placeholder="+225 07 XX XX XX"
                  value={studentForm.emergencyContactPhone}
                  onChange={e => setStudentForm({ ...studentForm, emergencyContactPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={studentForm.status}
                  onValueChange={v => setStudentForm({ ...studentForm, status: v as 'active' | 'inactive' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStudentFormOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveStudent} disabled={!studentFormValid}>
                {editStudent ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog modifier classe (depuis vue élèves) */}
        <Dialog open={classFormOpen} onOpenChange={setClassFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier la classe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom de la classe *</Label>
                <Input
                  placeholder="Ex: 6ème A"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Niveau *</Label>
                <Select
                  value={classForm.level}
                  onValueChange={v => setClassForm({ ...classForm, level: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Professeur principal</Label>
                <Input
                  placeholder="Ex: Mme Dupont"
                  value={classForm.mainTeacher}
                  onChange={e => setClassForm({ ...classForm, mainTeacher: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setClassFormOpen(false)}>Annuler</Button>
              <Button onClick={handleSaveClass} disabled={!classForm.name.trim()}>
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteStudentTarget}
          onClose={() => setDeleteStudentTarget(null)}
          onConfirm={handleDeleteStudent}
          title="Supprimer l'élève"
          description={`Supprimer ${deleteStudentTarget?.firstName} ${deleteStudentTarget?.lastName} de la classe ?`}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VUE CLASSES : grille principale
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description={`${classes.length} classe${classes.length !== 1 ? 's' : ''} · ${students.length} élève${students.length !== 1 ? 's' : ''}`}
      >
        <Button onClick={openAddClass}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une classe
        </Button>
      </PageHeader>

      {/* Stats par niveau */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LEVELS.map(level => {
          const lvlClasses = enrichedClasses.filter(c => c.level === level);
          const total = lvlClasses.reduce((sum, c) => sum + c.studentCount, 0);
          return (
            <div key={level} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{level}</span>
              </div>
              <p className="text-2xl font-bold">{lvlClasses.length}</p>
              <p className="text-xs text-muted-foreground">
                {total} élève{total !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...LEVELS].map(l => (
          <Button
            key={l}
            variant={levelFilter === l ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLevelFilter(l)}
          >
            {l === 'all' ? 'Tous les niveaux' : l}
          </Button>
        ))}
      </div>

      {/* Grille des classes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map(cls => (
          <div
            key={cls.id}
            className="group flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all animate-fade-in"
          >
            {/* Zone cliquable → vue étudiants */}
            <button
              className="flex items-center justify-between p-5 text-left flex-1 focus:outline-none"
              onClick={() => setSelectedClass(cls)}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-lg font-semibold text-card-foreground leading-tight">
                    {cls.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {cls.level}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  {cls.studentCount} élève{cls.studentCount !== 1 ? 's' : ''}
                </p>
                {cls.mainTeacher && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {cls.mainTeacher}
                  </p>
                )}
              </div>
              <ChevronRight className="ml-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
              <Button
                variant="ghost" size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => openEditClass(cls)}
              >
                <Edit className="h-3.5 w-3.5" />
                Modifier
              </Button>
              <Button
                variant="ghost" size="sm"
                className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteClassTarget(cls)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}

        {filteredClasses.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            Aucune classe. Cliquez sur « Ajouter une classe » pour commencer.
          </p>
        )}
      </div>

      {/* Dialog classe */}
      <Dialog open={classFormOpen} onOpenChange={setClassFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editClass ? 'Modifier la classe' : 'Ajouter une classe'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la classe *</Label>
              <Input
                placeholder="Ex: 6ème A"
                value={classForm.name}
                onChange={e => setClassForm({ ...classForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau *</Label>
              <Select
                value={classForm.level}
                onValueChange={v => setClassForm({ ...classForm, level: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Professeur principal</Label>
              <Input
                placeholder="Ex: Mme Dupont"
                value={classForm.mainTeacher}
                onChange={e => setClassForm({ ...classForm, mainTeacher: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setClassFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveClass} disabled={!classForm.name.trim()}>
              {editClass ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteClassTarget}
        onClose={() => setDeleteClassTarget(null)}
        onConfirm={handleDeleteClass}
        title="Supprimer la classe"
        description={`Supprimer "${deleteClassTarget?.name}" ?${
          students.filter(s => s.classId === deleteClassTarget?.id).length > 0
            ? ` Les ${students.filter(s => s.classId === deleteClassTarget?.id).length} élève(s) associé(s) seront aussi supprimés.`
            : ''
        }`}
      />
    </div>
  );
}
