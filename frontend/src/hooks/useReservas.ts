import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReserva,
  fetchReservas,
  fetchReservasByViatura,
  updateReserva,
} from '../services/reservas.service';
import type { CreateReservaPayload, UpdateReservaPayload } from '../types';

export function useTodasReservas() {
  return useQuery({
    queryKey: ['reservas'],
    queryFn: fetchReservas,
  });
}

export function useReservas(idViatura?: number) {
  return useQuery({
    queryKey: ['reservas', idViatura],
    queryFn: () => fetchReservasByViatura(idViatura!),
    enabled: Boolean(idViatura),
  });
}

export function useCreateReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservaPayload) => createReserva(payload),
    onSuccess: (reserva) => {
      void queryClient.invalidateQueries({ queryKey: ['reservas'] });
      void queryClient.invalidateQueries({ queryKey: ['reservas', reserva.IDViatura] });
    },
  });
}

export function useUpdateReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateReservaPayload }) =>
      updateReserva(id, payload),
    onSuccess: (reserva) => {
      void queryClient.invalidateQueries({ queryKey: ['reservas'] });
      void queryClient.invalidateQueries({ queryKey: ['reservas', reserva.IDViatura] });
    },
  });
}
