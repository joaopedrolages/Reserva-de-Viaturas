import { AlertCircle, CalendarDays, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ReservationCreateModal } from '../components/ReservationCreateModal';
import { ReservationList } from '../components/ReservationList';
import { ReturnModal } from '../components/ReturnModal';
import { VehicleCard } from '../components/VehicleCard';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { useTodasReservas } from '../hooks/useReservas';
import { useViaturas } from '../hooks/useViaturas';
import type { Reserva, Viatura } from '../types';
import { getVehicleColorById } from '../utils/vehicleColors';

interface SelectionRange {
  defaultViaturaId?: number;
  end: string;
  start: string;
}

const EMPTY_VIATURAS: Viatura[] = [];
const EMPTY_RESERVAS: Reserva[] = [];

function getDefaultReservationRange(defaultViaturaId: number): SelectionRange {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    defaultViaturaId,
    end: end.toISOString(),
    start: start.toISOString(),
  };
}

export function DashboardPage() {
  const [createRange, setCreateRange] = useState<SelectionRange | null>(null);
  const [returnReserva, setReturnReserva] = useState<Reserva | null>(null);

  const viaturasQuery = useViaturas();
  const reservasQuery = useTodasReservas();
  const viaturas = viaturasQuery.data ?? EMPTY_VIATURAS;
  const reservas = reservasQuery.data ?? EMPTY_RESERVAS;

  const reservationsByVehicle = useMemo(() => {
    const counts = new Map<number, number>();

    for (const reserva of reservas) {
      counts.set(reserva.IDViatura, (counts.get(reserva.IDViatura) ?? 0) + 1);
    }

    return counts;
  }, [reservas]);

  const openReservations = reservas.filter((reserva) => !reserva.datafimreal).length;
  const completedReservations = reservas.length - openReservations;

  const hasLoadError = viaturasQuery.isError || reservasQuery.isError;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Gestão de frota
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
              Reservas de viaturas
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="block text-xs text-slate-500">Viaturas</span>
              <strong className="text-lg text-slate-950">{viaturas.length}</strong>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="block text-xs text-amber-800">Ativas/futuras</span>
              <strong className="text-lg text-amber-950">{openReservations}</strong>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="block text-xs text-emerald-800">Concluídas</span>
              <strong className="text-lg text-emerald-950">{completedReservations}</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950">Legenda de viaturas</h2>
            {viaturasQuery.isFetching || reservasQuery.isFetching ? (
              <RefreshCw className="h-4 w-4 animate-spin text-slate-500" aria-hidden="true" />
            ) : null}
          </div>

          {viaturasQuery.isLoading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
              A carregar viaturas...
            </div>
          ) : null}

          {viaturasQuery.isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              <AlertCircle className="mb-2 h-5 w-5" aria-hidden="true" />
              Não foi possível carregar as viaturas.
            </div>
          ) : null}

          {!viaturasQuery.isLoading && !viaturasQuery.isError && viaturas.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
              Ainda não existem viaturas registadas.
            </div>
          ) : null}

          <div className="space-y-3">
            {viaturas.map((viatura) => (
              <VehicleCard
                color={getVehicleColorById(viaturas, viatura.ID)}
                key={viatura.ID}
                onReserve={() => setCreateRange(getDefaultReservationRange(viatura.ID))}
                reservasCount={reservationsByVehicle.get(viatura.ID) ?? 0}
                viatura={viatura}
              />
            ))}
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Calendário semanal
              </div>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Todas as viaturas</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
                Cor = viatura
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                Tom claro = concluída
              </span>
            </div>
          </div>

          {hasLoadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              Não foi possível carregar todos os dados da frota.
            </div>
          ) : null}

          <WeeklyCalendar
            isLoading={
              viaturasQuery.isLoading ||
              reservasQuery.isLoading ||
              viaturasQuery.isFetching ||
              reservasQuery.isFetching
            }
            onReservaClick={(reserva) => setReturnReserva(reserva)}
            onSelectRange={(start, end) => {
              if (viaturas.length > 0) {
                setCreateRange({ start, end });
              }
            }}
            reservas={reservas}
            viaturas={viaturas}
          />

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-950">Reservas da frota</h2>
            <ReservationList
              isLoading={reservasQuery.isLoading}
              onReturnClick={(reserva) => setReturnReserva(reserva)}
              reservas={reservas}
              viaturas={viaturas}
            />
          </div>
        </section>
      </main>

      {createRange ? (
        <ReservationCreateModal
          defaultViaturaId={createRange.defaultViaturaId}
          onClose={() => setCreateRange(null)}
          range={createRange}
          reservas={reservas}
          viaturas={viaturas}
        />
      ) : null}

      {returnReserva ? (
        <ReturnModal onClose={() => setReturnReserva(null)} reserva={returnReserva} />
      ) : null}
    </div>
  );
}
