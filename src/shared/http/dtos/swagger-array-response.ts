import { z } from 'zod';

const metaSchema = z.object({
  listed: z.number().describe('Number of items listed'),
  total: z.number().describe('Total number of items'),
  page: z.number().describe('Page number'),
  totalPages: z.number().describe('Total number of pages'),
});

export function swaggerArrayResponse<T extends z.ZodType>(
  schema: T,
  pagination: boolean = true,
) {
  const arraySchema = z.object({
    data: z.array(schema),
    ...(pagination && { meta: metaSchema }),
  });

  const swaggerSchema = z.toJSONSchema(arraySchema) as Record<string, unknown>;

  return {
    swaggerSchema,
    arraySchema,
  };
}
