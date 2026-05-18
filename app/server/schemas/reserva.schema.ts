import { z } from 'zod';

const nullableDate = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === '') {
    return null;
  }

  return value;
}, z.coerce.date().nullable().optional());

const nullableInteger = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === '') {
    return null;
  }

  return value;
}, z.coerce.number().int().min(0).nullable().optional());

const nullableText = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}, z.string().nullable().optional());

export const createReservaSchema = z
  .object({
    IDViatura: z.coerce.number().int().positive('A viatura é obrigatória.'),
    NomeCondutor: z.string().trim().min(1, 'O nome do condutor é obrigatório.').max(100),
    DataInicio: z.coerce.date(),
    DataFim: z.coerce.date(),
  })
  .strict()
  .refine((data) => data.DataFim > data.DataInicio, {
    message: 'A data fim deve ser posterior à data início.',
    path: ['DataFim'],
  });

export const updateReservaSchema = z
  .object({
    km: nullableInteger,
    processo: nullableText,
    datafimreal: nullableDate,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie pelo menos um campo para atualizar.',
  });

export type CreateReservaInput = z.infer<typeof createReservaSchema>;
export type UpdateReservaInput = z.infer<typeof updateReservaSchema>;
