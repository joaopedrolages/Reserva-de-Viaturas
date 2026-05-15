import { Router } from 'express';
import { reservasRoutes } from './reservas.routes';
import { viaturasRoutes } from './viaturas.routes';

export const apiRoutes = Router();

apiRoutes.use('/viaturas', viaturasRoutes);
apiRoutes.use('/reservas', reservasRoutes);
