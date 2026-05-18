import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error';
import { reservasService } from '../services/reservas.service';

export const listReservas: RequestHandler = async (_req, res) => {
  const reservas = await reservasService.listAll();
  res.json(reservas);
};

export const listReservasByViatura: RequestHandler = async (req, res) => {
  const idViatura = Number(req.params.idViatura);

  if (!Number.isInteger(idViatura) || idViatura <= 0) {
    throw new AppError(400, 'Identificador da viatura inválido.');
  }

  const reservas = await reservasService.listByViatura(idViatura);
  res.json(reservas);
};

export const createReserva: RequestHandler = async (req, res) => {
  const reserva = await reservasService.create(req.body);
  res.status(201).json(reserva);
};

export const updateReservaReturn: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Identificador da reserva inválido.');
  }

  const reserva = await reservasService.updateReturnData(id, req.body);
  res.json(reserva);
};
