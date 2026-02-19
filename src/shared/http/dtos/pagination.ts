import z from 'zod/v4';

export const paginationSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .describe('The limit per page'),
  page: z.coerce.number().int().positive().default(1).describe('The page'),
});
