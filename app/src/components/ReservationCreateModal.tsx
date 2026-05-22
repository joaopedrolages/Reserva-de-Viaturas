import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateReserva } from '../hooks/useReservas';
import { createReservaFormSchema, type CreateReservaFormValues } from '../schemas/reserva';
import { getApiErrorMessage } from '../services/api';
import type { Reserva, Viatura } from '../types';
import { rangesOverlap, toDatetimeLocalValue, toIsoFromDatetimeLocal } from '../utils/date';
import { Button } from './ui/Button';
import { FieldError } from './ui/FieldError';
import { Modal } from './ui/Modal';

interface ReservationCreateModalProps {
  defaultViaturaId?: number;
  onClose: () => void;
  range: {
    end: string;
    start: string;
  };
  reservas: Reserva[];
  viaturas: Viatura[];
}

function getAvailableDefaultViaturaId(
  viaturas: Viatura[],
  reservas: Reserva[],
  range: ReservationCreateModalProps['range'],
  defaultViaturaId?: number,
) {
  if (defaultViaturaId) {
    return defaultViaturaId;
  }

  return (
    viaturas.find(
      (viatura) =>
        !reservas.some(
          (reserva) =>
            reserva.IDViatura === viatura.ID &&
            !reserva.datafimreal &&
            rangesOverlap(range.start, range.end, reserva.DataInicio, reserva.DataFim),
        ),
    )?.ID ??
    viaturas[0]?.ID ??
    ''
  );
}

export function ReservationCreateModal({
  defaultViaturaId,
  onClose,
  range,
  reservas,
  viaturas,
}: ReservationCreateModalProps) {
  const selectedViatura = viaturas.find((viatura) => viatura.ID === defaultViaturaId);
  const defaultFormViaturaId = getAvailableDefaultViaturaId(
    viaturas,
    reservas,
    range,
    defaultViaturaId,
  );
  const createReserva = useCreateReserva();
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateReservaFormValues>({
    resolver: zodResolver(createReservaFormSchema),
    defaultValues: {
      IDViatura: String(defaultFormViaturaId),
      NomeCondutor: '',
      DataInicio: toDatetimeLocalValue(range.start),
      DataFim: toDatetimeLocalValue(range.end),
      descricao: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const idViatura = Number(values.IDViatura);
    const overlaps = reservas.some(
      (reserva) =>
        reserva.IDViatura === idViatura &&
        !reserva.datafimreal &&
        rangesOverlap(values.DataInicio, values.DataFim, reserva.DataInicio, reserva.DataFim),
    );

    if (overlaps) {
      setError('DataFim', {
        message: 'Este período sobrepõe-se a uma reserva existente para a viatura escolhida.',
      });
      toast.error('Já existe uma reserva desta viatura neste período.');
      return;
    }

    try {
      await createReserva.mutateAsync({
        IDViatura: idViatura,
        NomeCondutor: values.NomeCondutor.trim(),
        DataInicio: toIsoFromDatetimeLocal(values.DataInicio),
        DataFim: toIsoFromDatetimeLocal(values.DataFim),
        descricao: values.descricao?.trim() ? values.descricao.trim() : null,
      });
      toast.success('Reserva criada com sucesso.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <Modal
      description={
        selectedViatura
          ? `${selectedViatura.Nome} · confirme o período da reserva.`
          : 'Escolha a viatura e confirme o período selecionado no calendário.'
      }
      onClose={onClose}
      title="Criar reserva"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="IDViatura">
            Viatura
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="IDViatura"
            {...register('IDViatura')}
          >
            {viaturas.map((viatura) => (
              <option key={viatura.ID} value={viatura.ID}>
                {viatura.Nome}
              </option>
            ))}
          </select>
          <FieldError message={errors.IDViatura?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="NomeCondutor">
            Nome do condutor
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="NomeCondutor"
            placeholder="Ex.: Ana Martins"
            {...register('NomeCondutor')}
          />
          <FieldError message={errors.NomeCondutor?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="DataInicio">
              Data início
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
              id="DataInicio"
              type="datetime-local"
              {...register('DataInicio')}
            />
            <FieldError message={errors.DataInicio?.message} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="DataFim">
              Data fim
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
              id="DataFim"
              type="datetime-local"
              {...register('DataFim')}
            />
            <FieldError message={errors.DataFim?.message} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="descricao"
            maxLength={250}
            placeholder="Descrição da reserva, até 250 caracteres"
            {...register('descricao')}
          />
          <FieldError message={errors.descricao?.message} />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button
            icon={<CalendarPlus className="h-4 w-4" aria-hidden="true" />}
            isLoading={createReserva.isPending}
            type="submit"
          >
            Criar reserva
          </Button>
        </div>
      </form>
    </Modal>
  );
}
