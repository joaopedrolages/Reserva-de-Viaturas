import { prisma } from '../prisma/client';
import type { CreateViaturaInput } from '../schemas/viatura.schema';

export const viaturasRepository = {
  findAll() {
    return prisma.viatura.findMany({
      orderBy: { Nome: 'asc' },
    });
  },

  create(data: CreateViaturaInput) {
    return prisma.viatura.create({ data });
  },

  findById(ID: number) {
    return prisma.viatura.findUnique({ where: { ID } });
  },
};
