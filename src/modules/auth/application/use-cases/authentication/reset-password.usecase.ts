import { Injectable } from '@nestjs/common';
import { ITokenRepository } from '@/modules/auth/application/repositories';
import { IUsersRepository } from '@/modules/users/application/repositories';
import {
  InvalidInputException,
  UnauthorizedException,
} from '@/shared/exceptions';
import { IHashService } from '@/shared/services/hash';

interface ResetPasswordUseCaseRequest {
  email: string;
  code: string;
  password: string;
}

type ResetPasswordUseCaseResponse = void;

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hashService: IHashService,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(
    input: ResetPasswordUseCaseRequest,
  ): Promise<ResetPasswordUseCaseResponse> {
    const { email, code, password } = input;

    const user = await this.usersRepository.findByEmail({
      email,
    });

    if (!user) {
      throw new InvalidInputException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const token = await this.tokenRepository.findByCode({
      code,
    });

    if (!token || token.userId !== user.id) {
      throw new UnauthorizedException({
        message: 'invalid code',
        code: 'INVALID_CODE',
        data: { userId: user.id, code },
      });
    }

    user.password = await this.hashService.hash(password);
    user.updatedAt = new Date();

    await this.usersRepository.update(user);
    await this.tokenRepository.delete({
      id: token.id,
    });
  }
}
