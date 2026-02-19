import type { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

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

export const registrationBodyValidationPipe = new ZodValidationPipe(
  registrationBodySchema,
);

export type RegistrationBodySchema = z.infer<typeof registrationBodySchema>;

export const registrationBodySwaggerSchema = z.toJSONSchema(
  registrationBodySchema,
) as SchemasObject;

const registrationResponse = z.void();

export type RegistrationResponse = z.infer<typeof registrationResponse>;
