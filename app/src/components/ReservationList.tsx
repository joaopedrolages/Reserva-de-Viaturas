import { RotateCcw } from 'lucide-react';
import type { Reserva, Viatura } from '../types';
import { formatDateRange, formatDateTime } from '../utils/date';
import { getVehicleColorById } from '../utils/vehicleColors';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/Button';

interface ReservationListProps {
  isLoading: boolean;
  onReturnClick: (reserva: Reserva) => void;
  reservas: Reserva[];
  viaturas: Viatura[];
}

export function ReservationList({
  isLoading,
  onReturnClick,
  reservas,
  viaturas,
}: ReservationListProps) {
  const vehicleById = new Map(viaturas.map((viatura) => [viatura.ID, viatura]));

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
        A carregar lista de reservas...
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="font-medium text-slate-900">Sem reservas reservadas</p>
        <p className="mt-1 text-sm text-slate-500">
          Selecione um período no calendário para criar a primeira reserva.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Período</th>
              <th className="px-4 py-3">Viatura</th>
              <th className="px-4 py-3">Condutor</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Devolução</th>
              <th className="px-4 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservas.map((reserva) => {
              const color = getVehicleColorById(viaturas, reserva.IDViatura);
              const viatura = reserva.viatura ?? vehicleById.get(reserva.IDViatura);

              return (
                <tr key={reserva.ID} className="align-top">
                  <td className="px-4 py-4 text-slate-700">
                    {formatDateRange(reserva.DataInicio, reserva.DataFim)}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color.dot }}
                        aria-hidden="true"
                      />
                      {viatura?.Nome ?? `Viatura ${reserva.IDViatura}`}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">{reserva.NomeCondutor}</td>
                  <td className="max-w-xs px-4 py-4 text-slate-600">
                    {reserva.descricao ? (
                      <span className="line-clamp-2">{reserva.descricao}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge reserva={reserva} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {reserva.datafimreal ? (
                      <span>{formatDateTime(reserva.datafimreal)}</span>
                    ) : (
                      <span className="text-amber-800">Por registar</span>
                    )}
                    {typeof reserva.km === 'number' ? (
                      <span className="mt-1 block text-xs text-slate-500">{reserva.km} km</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      className="whitespace-nowrap"
                      icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
                      onClick={() => onReturnClick(reserva)}
                      variant="secondary"
                    >
                      {reserva.datafimreal ? 'Editar devolução' : 'Registar devolução'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
