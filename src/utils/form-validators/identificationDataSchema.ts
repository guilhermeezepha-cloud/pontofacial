import {z} from 'zod';

export const identificationDataSchema = z.object({
  code: z.string().nonempty('Código do coletor é obrigatório'),
  groupCode: z.string().nonempty('Código do grupo é obrigatório'),
  apiUrl: z
    .string()
    .nonempty('URL é obrigatória')
    .url('Formato de URL inválido'),
  identifier: z.string().nonempty('Identificador único é obrigatório'),
});

export type IdentificationDataFormValues = z.infer<
  typeof identificationDataSchema
>;
