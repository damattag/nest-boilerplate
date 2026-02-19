import { User, UsersProps } from "@/modules/users/domain";
import { faker } from "@faker-js/faker";

export function makeUser(overrrides: Partial<UsersProps>): User {
  return User.create({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    ...overrrides
  })
}