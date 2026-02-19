import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { IHashService } from '@/shared/services/hash';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = void;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(
    input: CreateUserUseCaseRequest,
  ): Promise<CreateUserUseCaseResponse> {
    const { password, ...rest } = input;

    const hashPassword = await this.hashService.hash(password);

    const user = User.create({
      ...rest,
      password: hashPassword,
    });

    await this.usersRepository.create(user);
  }
}
