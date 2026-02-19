import type { Prisma, User as PrismaUser } from '@/generated/prisma/client';
import { User } from '@/modules/users/domain';

export class UsersMapper {
  static toDomain(data: PrismaUser): User {
    return User.create({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  static toPersistence(data: User): Prisma.UserUncheckedCreateInput {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }
}
