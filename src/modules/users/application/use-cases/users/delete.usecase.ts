import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { InvalidInputException } from '@/shared/exceptions';

interface DeleteUserUseCaseRequest {
  id: string;
}

type DeleteUserUseCaseResponse = void;

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(
    input: DeleteUserUseCaseRequest,
  ): Promise<DeleteUserUseCaseResponse> {
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

    await this.usersRepository.delete({
      id,
    });
  }
}
