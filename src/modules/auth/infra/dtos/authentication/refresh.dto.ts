import { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod/v4';
import { ZodValidationPipe } from '@/shared/http/pipes';

const refreshBodySchema = z.object({
  refresh_token: z.string().describe('Refresh token'),
});

export type RefreshBodySchema = z.infer<typeof refreshBodySchema>;

export const refreshBodyValidationPipe = new ZodValidationPipe(
  refreshBodySchema,
);

export const refreshBodySwaggerSchema = z.toJSONSchema(
  refreshBodySchema,
) as SchemasObject;

const refreshResponse = z.object({
  access: z.string().describe("User's access token"),
  refresh: z.string().describe("User's refresh token"),
});

export type RefreshResponse = z.infer<typeof refreshResponse>;

export const refreshResponseSwagger = z.toJSONSchema(
  refreshResponse,
) as SchemasObject;
