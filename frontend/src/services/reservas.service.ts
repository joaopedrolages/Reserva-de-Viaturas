import { api } from './api';
import type { CreateReservaPayload, Reserva, UpdateReservaPayload } from '../types';

export async function fetchReservas() {
  const { data } = await api.get<Reserva[]>('/reservas');
  return data;
}

export async function fetchReservasByViatura(idViatura: number) {
  const { data } = await api.get<Reserva[]>(`/reservas/${idViatura}`);
  return data;
}

export async function createReserva(payload: CreateReservaPayload) {
  const { data } = await api.post<Reserva>('/reservas', payload);
  return data;
}

export async function updateReserva(id: number, payload: UpdateReservaPayload) {
  const { data } = await api.patch<Reserva>(`/reservas/${id}`, payload);
  return data;
}
