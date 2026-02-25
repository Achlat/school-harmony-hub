import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'active'
          ? 'bg-success/10 text-success'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          status === 'active' ? 'bg-success' : 'bg-muted-foreground'
        )}
      />
      {status === 'active' ? 'Actif' : 'Inactif'}
    </span>
  );
}
