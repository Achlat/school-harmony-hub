import { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockClasses } from '@/data/mock';
import type { SchoolClass } from '@/types';

const LEVELS = ['6ème', '5ème', '4ème', '3ème'];

export default function ClassesPage() {
  const [classes, setClasses] = useState(mockClasses);
  const [editItem, setEditItem] = useState<SchoolClass | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);
  const [levelFilter, setLevelFilter] = useState('all');

  const [form, setForm] = useState({ name: '', level: '6ème', mainTeacher: '' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', level: '6ème', mainTeacher: '' });
    setIsFormOpen(true);
  };

  const openEdit = (c: SchoolClass) => {
    setEditItem(c);
    setForm({ name: c.name, level: c.level, mainTeacher: c.mainTeacher || '' });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      setClasses(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
    } else {
      setClasses(prev => [...prev, {
        id: String(Date.now()),
        name: form.name,
        level: form.level,
        mainTeacher: form.mainTeacher,
        studentCount: 0,
      }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setClasses(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered = levelFilter === 'all'
    ? classes
    : classes.filter(c => c.level === levelFilter);

  const columns = [
    {
      key: 'name', header: 'Classe',
      render: (c: SchoolClass) => (
        <span className="font-semibold text-card-foreground">{c.name}</span>
      ),
    },
    {
      key: 'level', header: 'Niveau',
      render: (c: SchoolClass) => <Badge variant="secondary">{c.level}</Badge>,
    },
    {
      key: 'mainTeacher', header: 'Professeur principal', className: 'hidden md:table-cell',
      render: (c: SchoolClass) => c.mainTeacher || '—',
    },
    {
      key: 'studentCount', header: 'Élèves',
      render: (c: SchoolClass) => (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{c.studentCount}</span>
        </div>
      ),
    },
    {
      key: 'actions', header: '',
      render: (c: SchoolClass) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); openEdit(c); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setDeleteTarget(c); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Gestion des classes de l'établissement">
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Ajouter une classe</Button>
      </PageHeader>

      {/* Stats par niveau */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LEVELS.map(level => {
          const cls = classes.filter(c => c.level === level);
          const total = cls.reduce((s, c) => s + c.studentCount, 0);
          return (
            <div key={level} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{level}</span>
              </div>
              <p className="text-2xl font-bold">{cls.length}</p>
              <p className="text-xs text-muted-foreground">{total} élèves</p>
            </div>
          );
        })}
      </div>

      {/* Filtre niveau */}
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

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Rechercher une classe..."
        searchKey="name"
      />

      {/* Formulaire */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Modifier la classe' : 'Ajouter une classe'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la classe *</Label>
              <Input
                placeholder="Ex: 6ème A"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau *</Label>
              <Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}>
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
                value={form.mainTeacher}
                onChange={e => setForm({ ...form, mainTeacher: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editItem ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer la classe"
        description={`Supprimer "${deleteTarget?.name}" ? Les élèves associés ne seront pas supprimés.`}
      />
    </div>
  );
}
