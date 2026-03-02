import { Users, UserCog, BookOpen, School, Banknote, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/shared/StatsCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockDashboardStats, mockNotifications, studentsPerClass, coursesPerSubject, mockInvoices } from '@/data/mock';
import { formatFCFA } from '@/lib/export';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(220, 65%, 38%)', 'hsl(174, 60%, 40%)', 'hsl(38, 92%, 50%)',
  'hsl(152, 60%, 40%)', 'hsl(280, 60%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(200, 70%, 45%)',
];

const TYPE_COLORS: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  error: 'bg-destructive',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const totalInvoiced = mockInvoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = mockInvoices.reduce((s, i) => s + i.paidAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de votre établissement" />

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Élèves"
          value={mockDashboardStats.totalStudents}
          icon={Users}
          trend="+12 ce mois"
          trendUp
          iconClassName="bg-primary/10 text-primary"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/classes')}
        />
        <StatsCard
          title="Enseignants"
          value={mockDashboardStats.totalTeachers}
          icon={UserCog}
          iconClassName="bg-accent/10 text-accent"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/staff')}
        />
        <StatsCard
          title="Cours actifs"
          value={mockDashboardStats.totalCourses}
          icon={BookOpen}
          iconClassName="bg-warning/10 text-warning"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/courses')}
        />
        <StatsCard
          title="Classes"
          value={mockDashboardStats.totalClasses}
          icon={School}
          iconClassName="bg-success/10 text-success"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/classes')}
        />
        <StatsCard
          title="Facturé"
          value={formatFCFA(totalInvoiced)}
          icon={Banknote}
          iconClassName="bg-info/10 text-info"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/invoices')}
        />
        <StatsCard
          title="Encaissé"
          value={formatFCFA(totalCollected)}
          icon={TrendingUp}
          iconClassName="bg-success/10 text-success"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/finance')}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Élèves par classe</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={studentsPerClass}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 15%, 90%)', borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="count" fill="hsl(220, 65%, 38%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Cours par matière</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={coursesPerSubject}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="count"
                nameKey="name"
                paddingAngle={3}
              >
                {coursesPerSubject.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 15%, 90%)', borderRadius: '8px', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {coursesPerSubject.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications récentes */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Notifications récentes</h3>
        <div className="space-y-3">
          {mockNotifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 transition-colors',
                n.read ? 'bg-transparent' : 'bg-muted/50'
              )}
            >
              <span
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  TYPE_COLORS[n.type] ?? 'bg-muted-foreground'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
              <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
                {new Date(n.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
