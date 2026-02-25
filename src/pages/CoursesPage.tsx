import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCourses, mockClasses, mockStaff } from '@/data/mock';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export default function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [editItem, setEditItem] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  const [form, setForm] = useState({
    subject: '', classId: '', teacherId: '', room: '',
    dayOfWeek: 0, startTime: '08:00', endTime: '09:00',
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ subject: '', classId: '', teacherId: '', room: '', dayOfWeek: 0, startTime: '08:00', endTime: '09:00' });
    setIsFormOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditItem(c);
    setForm({ subject: c.subject, classId: c.classId, teacherId: c.teacherId, room: c.room, dayOfWeek: c.dayOfWeek, startTime: c.startTime, endTime: c.endTime });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    const cls = mockClasses.find(c => c.id === form.classId);
    const teacher = mockStaff.find(s => s.id === form.teacherId);
    if (editItem) {
      setCourses(prev => prev.map(c => c.id === editItem.id ? {
        ...c, ...form, className: cls?.name, teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
      } : c));
    } else {
      setCourses(prev => [...prev, {
        ...form, id: String(Date.now()), className: cls?.name, teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        color: `hsl(${Math.random() * 360}, 60%, 45%)`,
      }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setCourses(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filteredCourses = selectedClassFilter === 'all' ? courses : courses.filter(c => c.classId === selectedClassFilter);

  const columns = [
    { key: 'subject', header: 'Matière', render: (c: Course) => <span className="font-medium text-card-foreground">{c.subject}</span> },
    { key: 'className', header: 'Classe' },
    { key: 'teacherName', header: 'Enseignant', className: 'hidden sm:table-cell' },
    { key: 'room', header: 'Salle', className: 'hidden md:table-cell' },
    { key: 'day', header: 'Jour', render: (c: Course) => DAYS[c.dayOfWeek] },
    { key: 'time', header: 'Horaire', render: (c: Course) => `${c.startTime} - ${c.endTime}` },
    {
      key: 'actions', header: '',
      render: (c: Course) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(c); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  // Schedule grid helper
  const getCoursesForSlot = (day: number, hour: string) =>
    filteredCourses.filter(c => c.dayOfWeek === day && c.startTime === hour);

  return (
    <div className="space-y-6">
      <PageHeader title="Cours & Planning" description="Gestion des cours et de la programmation">
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter un cours</Button>
      </PageHeader>

      {/* Class filter */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={selectedClassFilter === 'all' ? 'default' : 'outline'} onClick={() => setSelectedClassFilter('all')}>
          Toutes les classes
        </Button>
        {mockClasses.map(cls => (
          <Button
            key={cls.id}
            size="sm"
            variant={selectedClassFilter === cls.id ? 'default' : 'outline'}
            onClick={() => setSelectedClassFilter(cls.id)}
          >
            {cls.name}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="schedule">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <DataTable
            data={filteredCourses}
            columns={columns}
            searchPlaceholder="Rechercher un cours..."
            searchKey="subject"
          />
        </TabsContent>

        <TabsContent value="schedule">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-3 text-left font-semibold text-muted-foreground w-20">Heure</th>
                  {DAYS.map(d => (
                    <th key={d} className="px-3 py-3 text-left font-semibold text-muted-foreground">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map(hour => (
                  <tr key={hour} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-2 text-xs text-muted-foreground font-medium">{hour}</td>
                    {DAYS.map((_, dayIdx) => {
                      const slotCourses = getCoursesForSlot(dayIdx, hour);
                      return (
                        <td key={dayIdx} className="px-1 py-1">
                          {slotCourses.map(c => (
                            <div
                              key={c.id}
                              className="rounded-lg px-2 py-1.5 text-xs mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: c.color ? `${c.color.replace(')', ', 0.15)')}` : 'hsl(220, 65%, 38%, 0.15)',
                                color: c.color || 'hsl(220, 65%, 38%)',
                                borderLeft: `3px solid ${c.color || 'hsl(220, 65%, 38%)'}`,
                              }}
                              onClick={() => openEdit(c)}
                            >
                              <p className="font-medium">{c.subject}</p>
                              <p className="opacity-70">{c.className} • {c.room}</p>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Matière</Label>
              <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
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
              <Label>Enseignant</Label>
              <Select value={form.teacherId} onValueChange={v => setForm({ ...form, teacherId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {mockStaff.filter(s => s.role === 'teacher').map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.lastName} {s.firstName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salle</Label>
              <Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Jour</Label>
              <Select value={String(form.dayOfWeek)} onValueChange={v => setForm({ ...form, dayOfWeek: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Début</Label>
              <Input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fin</Label>
              <Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editItem ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le cours"
        description={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.subject} - ${deleteTarget?.className} ?`}
      />
    </div>
  );
}
