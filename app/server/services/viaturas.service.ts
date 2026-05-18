import { AppError } from '../errors/app-error';
import { viaturasRepository } from '../repositories/viaturas.repository';
import type { CreateViaturaInput } from '../schemas/viatura.schema';

export const viaturasService = {
  list() {
    return viaturasRepository.findAll();
  },

  async create(data: CreateViaturaInput) {
    const nome = data.Nome.trim();

    if (!nome) {
      throw new AppError(400, 'O nome da viatura é obrigatório.');
    }

    return viaturasRepository.create({ Nome: nome });
  },
};
