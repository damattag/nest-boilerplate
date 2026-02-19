import { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod/v4';
import { ZodValidationPipe } from '@/shared/http/pipes';

const loginBodySchema = z.object({
  email: z.email().describe('User email'),
  password: z.string().describe('User password'),
});

export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export const loginBodyValidationPipe = new ZodValidationPipe(loginBodySchema);

export const loginBodySwaggerSchema = z.toJSONSchema(
  loginBodySchema,
) as SchemasObject;

const loginResponse = z.object({
  access: z.string().describe("User's access token"),
  refresh: z.string().describe("User's refresh token"),
});

export type LoginResponse = z.infer<typeof loginResponse>;

export const loginResponseSwagger = z.toJSONSchema(
  loginResponse,
) as SchemasObject;
