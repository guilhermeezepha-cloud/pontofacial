import {z} from 'zod';

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'No mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Mínimo 1 letra maiúscula')
  .regex(/[a-z]/, 'Mínimo 1 letra minúscula')
  .regex(/\d/, 'Mínimo 1 número')
  .regex(/[!@#$%&*]/, 'Mínimo 1 caractere especial (!, @, #, $, %, &, *)');

export const adminPasswordSchema = z.object({
  adminPassword: passwordSchema,
});

export const adminPasswordLoginSchema = z.object({
  adminPassword: z.string().min(1, 'Senha de administrador é obrigatória'),
});

export type AdminPasswordFormValues = z.infer<typeof adminPasswordSchema>;
