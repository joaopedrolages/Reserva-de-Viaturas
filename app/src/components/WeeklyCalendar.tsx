import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import ptLocale from '@fullcalendar/core/locales/pt';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarDays } from 'lucide-react';
import type { Reserva, Viatura } from '../types';
import { getVehicleColorById } from '../utils/vehicleColors';

interface WeeklyCalendarProps {
  isLoading: boolean;
  onEventReserve: (reserva: Reserva) => void;
  onSelectRange: (start: string, end: string) => void;
  reservas: Reserva[];
  viaturas: Viatura[];
}

export function WeeklyCalendar({
  isLoading,
  onEventReserve,
  onSelectRange,
  reservas,
  viaturas,
}: WeeklyCalendarProps) {
  const vehicleById = new Map(viaturas.map((viatura) => [viatura.ID, viatura]));
  const events: EventInput[] = reservas.map((reserva) => {
    const color = getVehicleColorById(viaturas, reserva.IDViatura);
    const viatura = reserva.viatura ?? vehicleById.get(reserva.IDViatura);
    const isCompleted = Boolean(reserva.datafimreal);

    return {
      id: String(reserva.ID),
      title: `${viatura?.Nome ?? 'Viatura'} · ${reserva.NomeCondutor}`,
      start: reserva.DataInicio,
      end: reserva.DataFim,
      backgroundColor: isCompleted ? color.completedBackground : color.background,
      borderColor: color.border,
      textColor: isCompleted ? color.border : color.text,
      classNames: [isCompleted ? 'event-completed' : 'event-open'],
      extendedProps: { reserva },
    };
  });

  const handleSelect = (selection: DateSelectArg) => {
    onSelectRange(selection.startStr, selection.endStr);
  };

  const handleEventClick = (event: EventClickArg) => {
    event.jsEvent.preventDefault();
    onEventReserve(event.event.extendedProps.reserva as Reserva);
  };

  if (viaturas.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <div>
          <CalendarDays className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-medium text-slate-900">Sem viaturas registadas</p>
          <p className="mt-1 text-sm text-slate-500">
            O calendário semanal aparece depois de existirem viaturas na base de dados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-4">
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/75 text-sm font-medium text-slate-700">
          A carregar reservas...
        </div>
      ) : null}
      <FullCalendar
        allDaySlot={false}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '19:00',
        }}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
        events={events}
        firstDay={1}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        }}
        height="auto"
        initialView="timeGridWeek"
        locale={ptLocale}
        nowIndicator
        plugins={[timeGridPlugin, interactionPlugin]}
        selectable
        select={handleSelect}
        selectMirror
        slotMaxTime="20:00:00"
        slotMinTime="07:00:00"
      />
    </div>
  );
}
