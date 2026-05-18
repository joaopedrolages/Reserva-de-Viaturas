import { z } from 'zod';

export const createReservaFormSchema = z
  .object({
    IDViatura: z.string().min(1, 'Escolha a viatura.'),
    NomeCondutor: z.string().trim().min(1, 'Indique o nome do condutor.').max(100),
    DataInicio: z.string().min(1, 'Indique a data de início.'),
    DataFim: z.string().min(1, 'Indique a data de fim.'),
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
      processo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.datafimreal) {
        return;
      }

      if (new Date(data.datafimreal) < new Date(dataInicio)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['datafimreal'],
          message: 'A data fim real não pode ser anterior à data início.',
        });
      }
    });
}

export type ReturnFormInput = z.input<ReturnType<typeof createReturnFormSchema>>;
export type ReturnFormValues = z.output<ReturnType<typeof createReturnFormSchema>>;
