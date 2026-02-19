export const APP_ENVIRONMENT_ENUM = [
  'development',
  'test',
  'production',
] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENT_ENUM)[number];

export const ORDER_BY_DIRECTION_ENUM = ['asc', 'desc'] as const;
export type OrderByDirection = (typeof ORDER_BY_DIRECTION_ENUM)[number];

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface OrderByInput<T, K extends keyof T = never> {
  orderByField?: keyof Pick<T, K>;
  orderByDirection?: OrderByDirection;
}

export interface ResponseMeta {
  listed: number;
  total: number;
  page: number;
  totalPages: number;
}
