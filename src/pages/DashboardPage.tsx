import { Users, UserCog, BookOpen, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/shared/StatsCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockDashboardStats, mockNotifications, studentsPerClass, coursesPerSubject } from '@/data/mock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(220, 65%, 38%)',
  'hsl(174, 60%, 40%)',
  'hsl(38, 92%, 50%)',
  'hsl(152, 60%, 40%)',
  'hsl(280, 60%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(200, 70%, 45%)',
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de votre établissement" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Étudiants"
          value={mockDashboardStats.totalStudents}
          icon={Users}
          trend="+12 ce mois"
          trendUp
          className="cursor-pointer hover:shadow-md transition-shadow"
          iconClassName="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Enseignants"
          value={mockDashboardStats.totalTeachers}
          icon={UserCog}
          iconClassName="bg-accent/10 text-accent"
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <StatsCard
          title="Cours actifs"
          value={mockDashboardStats.totalCourses}
          icon={BookOpen}
          iconClassName="bg-warning/10 text-warning"
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <StatsCard
          title="Classes"
          value={mockDashboardStats.totalClasses}
          icon={School}
          iconClassName="bg-success/10 text-success"
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Élèves par classe</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={studentsPerClass}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(220, 15%, 90%)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" fill="hsl(220, 65%, 38%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Cours par matière</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={coursesPerSubject}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="count"
                nameKey="name"
                paddingAngle={3}
              >
                {coursesPerSubject.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(220, 15%, 90%)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3 justify-center">
            {coursesPerSubject.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
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
              <div
                className={cn(
                  'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                  n.type === 'success' && 'bg-success',
                  n.type === 'warning' && 'bg-warning',
                  n.type === 'info' && 'bg-info',
                  n.type === 'error' && 'bg-destructive'
                )}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
              <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                {new Date(n.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
