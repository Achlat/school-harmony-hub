import { cn } from '@/lib/utils';
import type { InvoiceStatus } from '@/types';

const config: Record<InvoiceStatus, { label: string; dot: string; bg: string; text: string }> = {
  paid:    { label: 'Payée',    dot: 'bg-success',        bg: 'bg-success/10',    text: 'text-success' },
  partial: { label: 'Partielle', dot: 'bg-warning',       bg: 'bg-warning/10',    text: 'text-warning' },
  unpaid:  { label: 'Impayée',  dot: 'bg-destructive',    bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', c.bg, c.text)}>
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
