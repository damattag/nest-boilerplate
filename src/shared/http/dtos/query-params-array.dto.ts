import { z } from 'zod/v4';

export const queryParamsArraySchema = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return [];

    return value.split(',');
  });

export const queryParamsArraySwaggerSchema = z.string().optional();

export const queryParamsNumberArraySchema = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return [];

    const items = value.split(',');

    return items.map((item) => parseInt(item));
  });
