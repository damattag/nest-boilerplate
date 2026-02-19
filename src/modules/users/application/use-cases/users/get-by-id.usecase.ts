import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { InvalidInputException } from '@/shared/exceptions';

interface GetUserByIdUseCaseRequest {
  id: string;
}

type GetUserByIdUseCaseResponse = { user: User };

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(
    input: GetUserByIdUseCaseRequest,
  ): Promise<GetUserByIdUseCaseResponse> {
    const { id } = input;

    const user = await this.usersRepository.findById({
      id,
    });

    if (!user) {
      throw new InvalidInputException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        data: {
          id,
        },
      });
    }

    return { user };
  }
}
