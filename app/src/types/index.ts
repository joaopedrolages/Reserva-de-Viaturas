export interface Viatura {
  ID: number;
  Nome: string;
}

export interface Reserva {
  ID: number;
  IDViatura: number;
  NomeCondutor: string;
  DataInicio: string;
  DataFim: string;
  km: number | null;
  processo: string | null;
  datafimreal: string | null;
  viatura?: Viatura;
}

export interface CreateReservaPayload {
  IDViatura: number;
  NomeCondutor: string;
  DataInicio: string;
  DataFim: string;
}

export interface UpdateReservaPayload {
  km?: number | null;
  processo?: string | null;
  datafimreal?: string | null;
}

export interface ApiErrorResponse {
  message?: string;
  details?: unknown;
}
