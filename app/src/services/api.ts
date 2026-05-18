import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message ?? 'Não foi possível comunicar com o servidor.';
  }

  return 'Ocorreu um erro inesperado.';
}
