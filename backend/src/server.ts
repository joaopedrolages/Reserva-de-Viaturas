import { app } from './app';
import { env } from './config/env';
import { prisma } from './prisma/client';

const server = app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});
