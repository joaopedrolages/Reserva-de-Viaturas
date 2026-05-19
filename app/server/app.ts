import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { prisma } from './prisma/client';
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

app.get('/api/health', async (_req, res) => {
  try {
    const [viaturas, reservas] = await Promise.all([
      prisma.viatura.count(),
      prisma.reserva.count(),
    ]);

    res.json({
      database: 'mysql',
      mode: 'standalone',
      status: 'ok',
      tables: { reservas, viaturas },
    });
  } catch {
    res.status(503).json({
      database: 'unreachable',
      message: 'Nao foi possivel ler as tabelas MySQL esperadas.',
      mode: 'standalone',
      status: 'error',
    });
  }
});

app.use('/api', apiRoutes);

const clientDistPath = path.resolve(process.cwd(), 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
  });
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
