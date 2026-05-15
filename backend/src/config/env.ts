import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const env = {
  port,
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
};
