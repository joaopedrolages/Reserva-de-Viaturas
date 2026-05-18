import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { CreateReservaInput } from '../schemas/reserva.schema';

export const reservasRepository = {
  findAll() {
    return prisma.reserva.findMany({
      include: { viatura: true },
      orderBy: { DataInicio: 'asc' },
    });
  },

  findByViatura(IDViatura: number) {
    return prisma.reserva.findMany({
      where: { IDViatura },
      include: { viatura: true },
      orderBy: { DataInicio: 'asc' },
    });
  },

  findById(ID: number) {
    return prisma.reserva.findUnique({ where: { ID } });
  },

  async existsOverlapping(IDViatura: number, DataInicio: Date, DataFim: Date) {
    const reserva = await prisma.reserva.findFirst({
      where: {
        IDViatura,
        DataInicio: { lt: DataFim },
        DataFim: { gt: DataInicio },
      },
      select: { ID: true },
    });

    return Boolean(reserva);
  },

  create(data: CreateReservaInput) {
    return prisma.reserva.create({ data });
  },

  updateReturnData(ID: number, data: Prisma.ReservaUpdateInput) {
    return prisma.reserva.update({
      where: { ID },
      data,
    });
  },
};
