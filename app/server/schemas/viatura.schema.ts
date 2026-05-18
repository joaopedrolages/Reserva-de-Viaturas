import { z } from 'zod';

export const createViaturaSchema = z
  .object({
    Nome: z.string().trim().min(1, 'O nome da viatura é obrigatório.').max(100),
  })
  .strict();

export type CreateViaturaInput = z.infer<typeof createViaturaSchema>;
