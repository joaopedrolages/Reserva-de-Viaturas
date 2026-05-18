import { api } from './api';
import type { Viatura } from '../types';

export async function fetchViaturas() {
  const { data } = await api.get<Viatura[]>('/viaturas');
  return data;
}

export async function createViatura(Nome: string) {
  const { data } = await api.post<Viatura>('/viaturas', { Nome });
  return data;
}
