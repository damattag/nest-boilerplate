import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { InvalidInputException } from '@/shared/exceptions';

interface UpdateUserUseCaseRequest {
  id: string;
  name?: string;
  email?: string;
}

type UpdateUserUseCaseResponse = void;

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(
    input: UpdateUserUseCaseRequest,
  ): Promise<UpdateUserUseCaseResponse> {
    const { id, name, email } = input;

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

    user.update({ name, email });

    await this.usersRepository.update(user);
  }
}
