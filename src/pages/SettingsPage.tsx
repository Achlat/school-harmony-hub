import { useState } from 'react';
import { Save, Building2, ShieldCheck, CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

export default function SettingsPage() {
  const [school, setSchool] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const [academicYear, setAcademicYear] = useState('2024-2025');

  const plan = 'Pro';
  const userCount = 5;
  const maxUsers = 10;

  const handleSaveSchool = () => {
    if (!school.name.trim()) {
      toast.error("Le nom de l'établissement est requis");
      return;
    }
    toast.success("Informations de l'établissement enregistrées");
  };

  const handleSaveYear = () => {
    toast.success('Année scolaire mise à jour');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Configuration de votre établissement" />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Informations établissement */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">Informations de l'établissement</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l'établissement *</Label>
              <Input
                placeholder="Ex : Collège Jean Moulin"
                value={school.name}
                onChange={e => setSchool({ ...school, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                placeholder="Adresse complète"
                value={school.address}
                onChange={e => setSchool({ ...school, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                placeholder="+XX XX XX XX XX"
                value={school.phone}
                onChange={e => setSchool({ ...school, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email de contact</Label>
              <Input
                type="email"
                placeholder="contact@votre-etablissement.com"
                value={school.email}
                onChange={e => setSchool({ ...school, email: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={handleSaveSchool}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">

          {/* Abonnement */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Abonnement</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan actuel</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Utilisateurs actifs</span>
                <span className="font-medium text-card-foreground">
                  {userCount} utilisateurs sur {maxUsers}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary rounded-full h-1.5 transition-all"
                  style={{ width: `${Math.round((userCount / maxUsers) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Année scolaire */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Année scolaire</h3>
            </div>
            <div className="space-y-2">
              <Label>Année scolaire en cours</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={handleSaveYear}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
