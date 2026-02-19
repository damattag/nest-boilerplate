import type { PaginationInput } from '@/shared/types/global';

export function buildPaginationQuery(input?: PaginationInput): {
  take?: number;
  skip?: number;
} {
  if (!input) {
    return {};
  }

  const { limit, page } = input;

  return {
    ...(limit && { take: limit }),
    ...(page && limit && { skip: (page - 1) * limit }),
  };
}
