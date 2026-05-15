import { Router } from 'express';
import {
  createReserva,
  listReservas,
  listReservasByViatura,
  updateReservaReturn,
} from '../controllers/reservas.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createReservaSchema, updateReservaSchema } from '../schemas/reserva.schema';

export const reservasRoutes = Router();

reservasRoutes.get('/', asyncHandler(listReservas));
reservasRoutes.get('/:idViatura', asyncHandler(listReservasByViatura));
reservasRoutes.post('/', validateBody(createReservaSchema), asyncHandler(createReserva));
reservasRoutes.patch('/:id', validateBody(updateReservaSchema), asyncHandler(updateReservaReturn));
