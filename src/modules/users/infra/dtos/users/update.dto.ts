import type { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import z from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const updateUserParamsSchema = z.object({
  id: z.uuidv4().describe('User ID'),
});

export type UpdateUserParamsSchema = z.infer<typeof updateUserParamsSchema>;

export const updateUserParamsValidationPipe = new ZodValidationPipe(
  updateUserParamsSchema,
);

export const updateUserParamsSwaggerSchema = z.toJSONSchema(
  updateUserParamsSchema,
) as SchemasObject;

const updateUserBodySchema = z
  .object({
    name: z.string().describe('User name'),
    email: z.email().describe('User email'),
  })
  .partial();

export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;

export const updateUserBodyValidationPipe = new ZodValidationPipe(
  updateUserBodySchema,
);

export const updateUserBodySwaggerSchema = z.toJSONSchema(
  updateUserBodySchema,
) as SchemasObject;

const updateUserResponseSchema = z.void();

export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;
