import type { Prisma } from '@prisma/client';
import { AppError } from '../errors/app-error';
import { reservasRepository } from '../repositories/reservas.repository';
import { viaturasRepository } from '../repositories/viaturas.repository';
import type { CreateReservaInput, UpdateReservaInput } from '../schemas/reserva.schema';

export const reservasService = {
  listAll() {
    return reservasRepository.findAll();
  },

  async listByViatura(IDViatura: number) {
    const viatura = await viaturasRepository.findById(IDViatura);

    if (!viatura) {
      throw new AppError(404, 'Viatura não encontrada.');
    }

    return reservasRepository.findByViatura(IDViatura);
  },

  async create(data: CreateReservaInput) {
    const viatura = await viaturasRepository.findById(data.IDViatura);

    if (!viatura) {
      throw new AppError(404, 'Viatura não encontrada.');
    }

    const hasConflict = await reservasRepository.existsOverlapping(
      data.IDViatura,
      data.DataInicio,
      data.DataFim,
    );

    if (hasConflict) {
      throw new AppError(409, 'Já existe uma reserva para esta viatura no período selecionado.');
    }

    return reservasRepository.create({
      ...data,
      NomeCondutor: data.NomeCondutor.trim(),
    });
  },

  async updateReturnData(ID: number, data: UpdateReservaInput) {
    const reserva = await reservasRepository.findById(ID);

    if (!reserva) {
      throw new AppError(404, 'Reserva não encontrada.');
    }

    if (data.datafimreal && data.datafimreal < reserva.DataInicio) {
      throw new AppError(400, 'A data fim real não pode ser anterior à data início.');
    }

    const updateData: Prisma.ReservaUpdateInput = {};

    if ('km' in data) {
      updateData.km = data.km;
    }

    if ('processo' in data) {
      updateData.processo = data.processo;
    }

    if ('datafimreal' in data) {
      updateData.datafimreal = data.datafimreal;
    }

    return reservasRepository.updateReturnData(ID, updateData);
  },
};
