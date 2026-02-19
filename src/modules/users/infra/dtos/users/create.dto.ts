import type { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const createUserBodySchema = z.object({
  name: z.string().describe('User name'),
  email: z.string().describe('User email'),
  password: z.string().describe('User password'),
});

export const createUserBodyValidationPipe = new ZodValidationPipe(
  createUserBodySchema,
);

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

export const createUserBodySwaggerSchema = z.toJSONSchema(
  createUserBodySchema,
) as SchemasObject;

const createUserResponse = z.void();

export type CreateUserResponse = z.infer<typeof createUserResponse>;
