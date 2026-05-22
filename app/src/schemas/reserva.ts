import { z } from 'zod';

export const createReservaFormSchema = z
  .object({
    IDViatura: z.string().min(1, 'Escolha a viatura.'),
    NomeCondutor: z.string().trim().min(1, 'Indique o nome do condutor.').max(100),
    DataInicio: z.string().min(1, 'Indique a data de início.'),
    DataFim: z.string().min(1, 'Indique a data de fim.'),
    descricao: z
      .string()
      .trim()
      .max(250, 'A descrição deve ter no máximo 250 caracteres.')
      .optional(),
  })
  .refine((data) => new Date(data.DataFim) > new Date(data.DataInicio), {
    message: 'A data fim deve ser posterior à data início.',
    path: ['DataFim'],
  });

export type CreateReservaFormValues = z.infer<typeof createReservaFormSchema>;

export function createReturnFormSchema(dataInicio: string) {
  return z
    .object({
      datafimreal: z.string().optional(),
      km: z.preprocess(
        (value) => {
          if (value === '' || value === null || value === undefined) {
            return undefined;
          }

          return Number(value);
        },
        z
          .number({ invalid_type_error: 'Indique um número inteiro válido.' })
          .int('Indique um número inteiro.')
          .min(0, 'Os km não podem ser negativos.')
          .optional(),
      ),
      processo: z.preprocess(
        (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
        z
          .string()
          .trim()
          .regex(/^\d{1,5}$/, 'O processo deve ter apenas números e no máximo 5 dígitos.')
          .optional(),
      ),
      proposta: z.preprocess(
        (value) => {
          if (value === '' || value === null || value === undefined) {
            return undefined;
          }

          return Number(value);
        },
        z
          .number({ invalid_type_error: 'Indique uma proposta numérica válida.' })
          .int('A proposta deve ser um número inteiro.')
          .min(0, 'A proposta não pode ser negativa.')
          .max(999999, 'A proposta deve ter no máximo 6 dígitos.')
          .optional(),
      ),
      descricao: z
        .string()
        .trim()
        .max(250, 'A descrição deve ter no máximo 250 caracteres.')
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.datafimreal && new Date(data.datafimreal) < new Date(dataInicio)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['datafimreal'],
          message: 'A data fim real não pode ser anterior à data início.',
        });
      }

      if (!data.processo?.trim() && data.proposta === undefined && !data.descricao?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['processo'],
          message: 'Preencha pelo menos processo, proposta ou descrição.',
        });
      }
    });
}

export type ReturnFormInput = z.input<ReturnType<typeof createReturnFormSchema>>;
export type ReturnFormValues = z.output<ReturnType<typeof createReturnFormSchema>>;
