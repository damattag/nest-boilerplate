import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User, UsersProps } from '@/modules/users/domain';
import { UsersMapper } from '@/modules/users/infra/database/mappers';
import { PrismaService } from '@/shared/database';

export function makeUser(overrides: Partial<UsersProps>): User {
  return User.create({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    ...overrides,
  });
}

@Injectable()
export class UserFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UsersProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: UsersMapper.toPersistence(user),
    });

    return user;
  }
}
