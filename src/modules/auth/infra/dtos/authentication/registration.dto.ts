import { createZodDto } from 'nest-swagger-zod';
import { z } from 'zod';

const registrationBodySchema = z.object({
  name: z.string().describe('User name'),
  email: z.email().describe('User email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    )
    .describe('User password'),
});

export type RegistrationBodySchema = z.infer<typeof registrationBodySchema>;

export class RegistrationBodyDto extends createZodDto<RegistrationBodySchema>(
  registrationBodySchema,
) {}

export const registrationBodySwaggerSchema = z.toJSONSchema(
  registrationBodySchema,
) as Record<string, unknown>;

const registrationResponse = z.void();

export type RegistrationResponse = z.infer<typeof registrationResponse>;
