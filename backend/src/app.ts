import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { apiRoutes } from './routes';

const app = express();

const corsOrigins = env.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
