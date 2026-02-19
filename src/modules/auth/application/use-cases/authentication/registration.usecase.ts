import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { IHashService } from '@/shared/services/hash';

interface RegistrationUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegistrationUseCaseResponse = void;

@Injectable()
export class RegistrationUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(
    input: RegistrationUseCaseRequest,
  ): Promise<RegistrationUseCaseResponse> {
    const { password, ...rest } = input;

    const hashPassword = await this.hashService.hash(password);

    const user = User.create({
      ...rest,
      password: hashPassword,
    });

    await this.usersRepository.create(user);
  }
}
