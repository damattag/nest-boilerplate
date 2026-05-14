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
) as Record<string, unknown>;

const deleteUserResponseSchema = z.void();

export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
