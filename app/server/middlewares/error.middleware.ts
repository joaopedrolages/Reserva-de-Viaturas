import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Os dados enviados são inválidos.',
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      message: 'Não foi possível executar a operação na base de dados.',
      details: { code: error.code },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  });
};
