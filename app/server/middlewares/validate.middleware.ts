import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../errors/app-error';

export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new AppError(400, 'Os dados enviados são inválidos.', result.error.flatten()));
      return;
    }

    req.body = result.data;
    next();
  };
