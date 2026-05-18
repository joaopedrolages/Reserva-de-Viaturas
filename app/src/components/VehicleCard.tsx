import { Car } from 'lucide-react';
import type { VehicleColor } from '../utils/vehicleColors';
import type { Viatura } from '../types';

interface VehicleCardProps {
  color: VehicleColor;
  onReserve: () => void;
  reservasCount: number;
  viatura: Viatura;
}

export function VehicleCard({ color, onReserve, reservasCount, viatura }: VehicleCardProps) {
  return (
    <button
      className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/60 focus:outline-none focus-visible:shadow-focus"
      onClick={onReserve}
      type="button"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: color.background }}
        >
          <Car className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-950">
            {viatura.Nome}
          </span>
          <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color.dot }}
              aria-hidden="true"
            />
            {reservasCount} reserva{reservasCount === 1 ? '' : 's'}
          </span>
        </span>
      </div>
    </button>
  );
}
