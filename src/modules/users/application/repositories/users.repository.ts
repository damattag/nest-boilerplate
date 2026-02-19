import type { User } from '@/modules/users/domain';
import type { OrderByInput, PaginationInput } from '@/shared/types/global';

export interface FindUserByIdInput {
  id: string;
}

export interface FindUserByEmailInput {
  email: string;
}

export interface DeleteUserInput {
  id: string;
}

interface ListUsersFilters {
  name?: string;
  email?: string;
  createdAtStartDate?: Date;
  createdAtEndDate?: Date;
}

export const ORDER_BY_USERS_FIELDS_ENUM = [
  'id',
  'name',
  'email',
  'createdAt',
] as const;

export type OrderByUsersFieldsEnum =
  (typeof ORDER_BY_USERS_FIELDS_ENUM)[number];

export type ListUsersInput = PaginationInput &
  ListUsersFilters &
  OrderByInput<User, OrderByUsersFieldsEnum>;

export abstract class IUsersRepository {
  abstract create(input: User): Promise<void>;
  abstract findById(input: FindUserByIdInput): Promise<User | null>;
  abstract findByEmail(input: FindUserByEmailInput): Promise<User | null>;
  abstract list(input: ListUsersInput): Promise<User[]>;
  abstract count(input: ListUsersInput): Promise<number>;
  abstract delete(input: DeleteUserInput): Promise<void>;
  abstract update(input: User): Promise<void>;
}
