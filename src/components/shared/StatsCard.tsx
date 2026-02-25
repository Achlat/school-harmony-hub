import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className, iconClassName }: StatsCardProps) {
  return (
    <div className={cn('rounded-xl bg-card p-5 border border-border shadow-sm animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-card-foreground">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trendUp ? 'text-success' : 'text-destructive')}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconClassName || 'bg-primary/10')}>
          <Icon className={cn('h-5 w-5', iconClassName ? 'text-current' : 'text-primary')} />
        </div>
      </div>
    </div>
  );
}
