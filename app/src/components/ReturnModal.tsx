import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  createReturnFormSchema,
  type ReturnFormInput,
  type ReturnFormValues,
} from '../schemas/reserva';
import { getApiErrorMessage } from '../services/api';
import type { Reserva } from '../types';
import { formatDateRange, toDatetimeLocalValue, toIsoFromDatetimeLocal } from '../utils/date';
import { useUpdateReserva } from '../hooks/useReservas';
import { Button } from './ui/Button';
import { FieldError } from './ui/FieldError';
import { Modal } from './ui/Modal';

interface ReturnModalProps {
  onClose: () => void;
  reserva: Reserva;
}

export function ReturnModal({ onClose, reserva }: ReturnModalProps) {
  const schema = useMemo(() => createReturnFormSchema(reserva.DataInicio), [reserva.DataInicio]);
  const updateReserva = useUpdateReserva();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ReturnFormInput, unknown, ReturnFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      datafimreal: reserva.datafimreal ? toDatetimeLocalValue(reserva.datafimreal) : '',
      km: reserva.km ?? '',
      processo: reserva.processo ?? '',
      proposta: reserva.proposta ?? '',
      descricao: reserva.descricao ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateReserva.mutateAsync({
        id: reserva.ID,
        payload: {
          datafimreal: values.datafimreal ? toIsoFromDatetimeLocal(values.datafimreal) : null,
          km: typeof values.km === 'number' ? values.km : null,
          processo: values.processo?.trim() ? values.processo.trim() : null,
          proposta: typeof values.proposta === 'number' ? values.proposta : null,
          descricao: values.descricao?.trim() ? values.descricao.trim() : null,
        },
      });
      toast.success('Dados de devolução guardados.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <Modal
      description={`${reserva.NomeCondutor} · ${formatDateRange(reserva.DataInicio, reserva.DataFim)}`}
      onClose={onClose}
      title={reserva.datafimreal ? 'Editar devolução' : 'Registar devolução'}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="datafimreal">
            Data fim real
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="datafimreal"
            type="datetime-local"
            {...register('datafimreal')}
          />
          <FieldError message={errors.datafimreal?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="km">
            Km percorridos
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="km"
            min={0}
            step={1}
            type="number"
            {...register('km')}
          />
          <FieldError message={errors.km?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="processo">
            Processo
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="processo"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]*"
            placeholder="5 dígitos"
            {...register('processo')}
          />
          <FieldError message={errors.processo?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="proposta">
            Proposta
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="proposta"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]*"
            placeholder="6 dígitos"
            {...register('proposta')}
          />
          <FieldError message={errors.proposta?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:shadow-focus"
            id="descricao"
            maxLength={250}
            placeholder="Descrição da atividade, até 250 caracteres"
            {...register('descricao')}
          />
          <FieldError message={errors.descricao?.message} />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button
            icon={<Save className="h-4 w-4" aria-hidden="true" />}
            isLoading={updateReserva.isPending}
            type="submit"
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
