import { PageHeader } from '@/components/shared/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Configuration de votre établissement" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* School info */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Informations de l'école</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom</span>
              <span className="font-medium text-card-foreground">École Internationale d'Abidjan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adresse</span>
              <span className="font-medium text-card-foreground">Cocody, Abidjan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone</span>
              <span className="font-medium text-card-foreground">+225 27 22 44 55 66</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-card-foreground">contact@ecole.ci</span>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Compte</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utilisateurs</span>
              <span className="font-medium text-card-foreground">5 / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Année scolaire</span>
              <span className="font-medium text-card-foreground">2024-2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
