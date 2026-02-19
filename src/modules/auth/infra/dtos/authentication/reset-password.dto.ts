import { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod';
import { ZodValidationPipe } from '@/shared/http/pipes';

const ResetPasswordBodySchema = z.object({
  email: z.email(),
  password: z.string(),
  code: z.string(),
});

export type ResetPasswordBodySchema = z.infer<typeof ResetPasswordBodySchema>;

export const resetPasswordBodyValidationPipe = new ZodValidationPipe(
  ResetPasswordBodySchema,
);

export const resetPasswordBodySwaggerSchema = z.toJSONSchema(
  ResetPasswordBodySchema,
) as SchemasObject;
