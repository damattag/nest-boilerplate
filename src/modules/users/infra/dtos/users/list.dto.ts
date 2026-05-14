import z from 'zod';
import { ORDER_BY_USERS_FIELDS_ENUM } from '@/modules/users/application/repositories';
import { paginationSchema } from '@/shared/http/dtos';
import { swaggerArrayResponse } from '@/shared/http/dtos/swagger-array-response';
import { ZodValidationPipe } from '@/shared/http/pipes';
import { ORDER_BY_DIRECTION_ENUM } from '@/shared/types/global';

const listUsersQueryParamsSchema = paginationSchema.extend({
  name: z.string().optional().describe('User name'),
  email: z.string().optional().describe('User email'),
  createdAtStartDate: z.coerce.date().optional(),
  createdAtEndDate: z.coerce.date().optional(),
  order_by_field: z
    .enum(ORDER_BY_USERS_FIELDS_ENUM)
    .default('id')
    .describe('Field to order by'),
  order_by_direction: z
    .enum(ORDER_BY_DIRECTION_ENUM)
    .default('asc')
    .describe('Direction to order by'),
});

export type ListUsersQueryParamsSchema = z.infer<
  typeof listUsersQueryParamsSchema
>;

export const listUsersQueryParamsValidationPipe = new ZodValidationPipe(
  listUsersQueryParamsSchema,
);

export const listUsersQueryParamsSwaggerSchema = z.toJSONSchema(
  listUsersQueryParamsSchema.extend({
    createdAtStartDate: z.iso
      .datetime()
      .optional()
      .describe('Created at start of date range'),
    createdAtEndDate: z.iso
      .datetime()
      .optional()
      .describe('Created at end of date range'),
  }),
) as Record<string, unknown>;

const responseSchema = z.object({
  id: z.uuidv4().describe('User ID'),
  name: z.string().nullable().describe('User name'),
  email: z.email().describe('User email'),
  createdAt: z.iso.datetime().describe('User creation date'),
});

const { arraySchema, swaggerSchema } = swaggerArrayResponse(responseSchema);

export type ListUsersResponse = z.infer<typeof arraySchema>;

export const listUsersResponseSwaggerSchema = swaggerSchema;
