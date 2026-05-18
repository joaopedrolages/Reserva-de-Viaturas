import { CheckCircle2, Clock3 } from 'lucide-react';
import type { Reserva } from '../types';

interface StatusBadgeProps {
  reserva: Reserva;
}

export function StatusBadge({ reserva }: StatusBadgeProps) {
  const isComplete = Boolean(reserva.datafimreal);

  return (
    <span
      className={
        isComplete
          ? 'inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800'
          : 'inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900'
      }
    >
      {isComplete ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {isComplete ? 'Concluída' : 'Ativa/futura'}
    </span>
  );
}
