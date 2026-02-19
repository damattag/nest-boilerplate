import { Injectable } from '@nestjs/common';
import { ITokenService } from '@/modules/auth/application/services';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { InvalidInputException } from '@/shared/exceptions';
import { IHashService } from '@/shared/services/hash';

interface LoginUseCaseRequest {
  email: string;
  password: string;
}

type LoginUseCaseResponse = { refresh: string; access: string };

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const { email, password } = input;

    const user = await this.usersRepository.findByEmail({
      email,
    });

    if (!user) {
      throw new InvalidInputException({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidInputException({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const access = await this.tokenService.generateAccessToken(user.id);
    const refresh = await this.tokenService.generateRefreshToken(user.id);

    return { access, refresh };
  }
}
