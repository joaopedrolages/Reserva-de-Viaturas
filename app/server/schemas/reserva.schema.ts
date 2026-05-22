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

const nullableLimitedText = (maxLength: number) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }, z.string().max(maxLength).nullable().optional());

const nullableNumericText = (maxLength: number, message: string) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }, z.string().regex(new RegExp(`^\\d{1,${maxLength}}$`), message).nullable().optional());

export const createReservaSchema = z
  .object({
    IDViatura: z.coerce.number().int().positive('A viatura é obrigatória.'),
    NomeCondutor: z.string().trim().min(1, 'O nome do condutor é obrigatório.').max(100),
    DataInicio: z.coerce.date(),
    DataFim: z.coerce.date(),
    descricao: nullableLimitedText(250),
  })
  .strict()
  .refine((data) => data.DataFim > data.DataInicio, {
    message: 'A data fim deve ser posterior à data início.',
    path: ['DataFim'],
  });

export const updateReservaSchema = z
  .object({
    km: nullableInteger,
    processo: nullableNumericText(5, 'O processo deve ter apenas números e no máximo 5 dígitos.'),
    proposta: nullableInteger.refine(
      (value) => value === undefined || value === null || value <= 999999,
      {
        message: 'A proposta deve ter no máximo 6 dígitos.',
      },
    ),
    descricao: nullableLimitedText(250),
    datafimreal: nullableDate,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie pelo menos um campo para atualizar.',
  })
  .refine(
    (data) =>
      Boolean(
        data.processo ||
          (data.proposta !== undefined && data.proposta !== null) ||
          data.descricao,
      ),
    {
      message: 'Preencha pelo menos processo, proposta ou descrição.',
    },
  );

export type CreateReservaInput = z.infer<typeof createReservaSchema>;
export type UpdateReservaInput = z.infer<typeof updateReservaSchema>;
