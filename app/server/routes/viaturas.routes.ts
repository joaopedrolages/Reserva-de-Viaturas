import { Router } from 'express';
import { createViatura, listViaturas } from '../controllers/viaturas.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createViaturaSchema } from '../schemas/viatura.schema';

export const viaturasRoutes = Router();

viaturasRoutes.get('/', asyncHandler(listViaturas));
viaturasRoutes.post('/', validateBody(createViaturaSchema), asyncHandler(createViatura));
