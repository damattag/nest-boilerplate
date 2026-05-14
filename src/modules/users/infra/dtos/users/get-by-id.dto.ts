import z from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const getUserByIdParamsSchema = z.object({
  id: z.uuidv4().describe('User ID'),
});

export type GetUserByIdParamsSchema = z.infer<typeof getUserByIdParamsSchema>;

export const getUserByIdParamsValidationPipe = new ZodValidationPipe(
  getUserByIdParamsSchema,
);

export const getUserByIdParamsSwaggerSchema = z.toJSONSchema(
  getUserByIdParamsSchema,
) as Record<string, unknown>;

const getUserByIdResponseSchema = z.object({
  id: z.uuidv4().describe('User ID'),
  name: z.string().describe('User name'),
  email: z.email().describe('User email'),
  createdAt: z.iso.datetime().describe('User creation date'),
});

export type GetUserByIdResponse = z.infer<typeof getUserByIdResponseSchema>;

export const getUserByIdResponseSwaggerSchema = z.toJSONSchema(
  getUserByIdResponseSchema,
) as Record<string, unknown>;
