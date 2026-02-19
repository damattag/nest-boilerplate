import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { PaginationInput } from '@/shared/types/global';

type ListUsersUseCaseRequest = PaginationInput & {
  name?: string;
  email?: string;
};

type ListUsersUseCaseResponse = {
  users: User[];
  count: number;
};

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(
    input: ListUsersUseCaseRequest,
  ): Promise<ListUsersUseCaseResponse> {
    const [users, count] = await Promise.all([
      this.usersRepository.list(input),
      this.usersRepository.count(input),
    ]);

    return { users, count };
  }
}
