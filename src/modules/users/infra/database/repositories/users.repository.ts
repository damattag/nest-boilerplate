import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type {
  DeleteUserInput,
  FindUserByEmailInput,
  FindUserByIdInput,
  IUsersRepository,
  ListUsersInput,
  OrderByUsersFieldsEnum,
} from '@/modules/users/application/repositories';
import { type User } from '@/modules/users/domain';
import { UsersMapper } from '@/modules/users/infra/database/mappers';
import { PrismaService } from '@/shared/database';
import { OrderByInput } from '@/shared/types/global';
import { buildPaginationQuery } from '@/shared/utils/build-pagination-query';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: User): Promise<void> {
    const data = UsersMapper.toPersistence(input);

    await this.prisma.user.create({
      data,
    });
  }

  async findById(input: FindUserByIdInput): Promise<User | null> {
    const { id } = input;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UsersMapper.toDomain(user);
  }

  async delete(input: DeleteUserInput): Promise<void> {
    const { id } = input;

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(input: User): Promise<void> {
    const { id, ...data } = UsersMapper.toPersistence(input);

    await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async list(input: ListUsersInput): Promise<User[]> {
    const { orderByDirection, orderByField } = input;

    const where = this.buildWhereClause(input);
    const { take, skip } = buildPaginationQuery(input);

    const users = await this.prisma.user.findMany({
      where,
      orderBy: this.buildOrderBy({ orderByDirection, orderByField }),
      take,
      skip,
    });

    return users.map(UsersMapper.toDomain);
  }

  async count(input: ListUsersInput): Promise<number> {
    const where = this.buildWhereClause(input);

    const count = await this.prisma.user.count({
      where,
    });

    return count;
  }

  async findByEmail(input: FindUserByEmailInput): Promise<User | null> {
    const { email } = input;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UsersMapper.toDomain(user);
  }

  private buildWhereClause(input: ListUsersInput): Prisma.UserWhereInput {
    const { name, email, createdAtEndDate, createdAtStartDate } = input;

    return {
      ...(name && { name: { contains: name } }),
      ...(email && { email: { contains: email } }),
      ...(createdAtStartDate && { createdAt: { gte: createdAtStartDate } }),
      ...(createdAtEndDate && { createdAt: { lte: createdAtEndDate } }),
      ...(createdAtStartDate &&
        createdAtEndDate && {
          createdAt: {
            gte: createdAtStartDate,
            lte: createdAtEndDate,
          },
        }),
    };
  }

  private buildOrderBy(
    input: OrderByInput<User, OrderByUsersFieldsEnum>,
  ): Prisma.UserOrderByWithRelationInput {
    const { orderByDirection, orderByField } = input;

    if (!orderByDirection || !orderByField) {
      return {
        id: 'asc',
      };
    }

    const fieldMapper: Record<
      OrderByUsersFieldsEnum,
      keyof Prisma.UserOrderByWithRelationInput
    > = {
      id: 'id',
      name: 'name',
      email: 'email',
      createdAt: 'createdAt',
    };

    const field = fieldMapper[orderByField];

    if (!field) {
      return {
        id: 'asc',
      };
    }

    return {
      [field]: orderByDirection,
    };
  }
}
