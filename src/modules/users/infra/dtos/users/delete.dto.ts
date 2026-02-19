import type { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import z from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const deleteUserParamsSchema = z.object({
  id: z.uuidv4().describe('User ID'),
});

export type DeleteUserParamsSchema = z.infer<typeof deleteUserParamsSchema>;

export const deleteUserParamsValidationPipe = new ZodValidationPipe(
  deleteUserParamsSchema,
);

export const deleteUserParamsSwaggerSchema = z.toJSONSchema(
  deleteUserParamsSchema,
) as SchemasObject;

const deleteUserResponseSchema = z.void();

export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
