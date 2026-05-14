import { z } from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const ResetPasswordRequestBodySchema = z.object({
  email: z.email().describe('User email'),
});

export type ResetPasswordRequestBodySchema = z.infer<
  typeof ResetPasswordRequestBodySchema
>;

export const resetPasswordRequestBodyValidationPipe = new ZodValidationPipe(
  ResetPasswordRequestBodySchema,
);

export const resetPasswordRequestBodySwaggerSchema = z.toJSONSchema(
  ResetPasswordRequestBodySchema,
) as Record<string, unknown>;
