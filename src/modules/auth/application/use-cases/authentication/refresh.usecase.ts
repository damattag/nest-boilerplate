import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenService } from '@/modules/auth/application/services';
import { IUsersRepository } from '@/modules/users/application/repositories';

interface RefreshUseCaseRequest {
  refreshToken: string;
}

type RefreshUseCaseResponse = { refresh: string; access: string };

@Injectable()
export class RefreshUseCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RefreshUseCaseRequest): Promise<RefreshUseCaseResponse> {
    const { refreshToken } = input;

    const { sub } = await this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.usersRepository.findById({
      id: sub,
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    const access = await this.tokenService.generateAccessToken(user.id);
    const newRefresh = await this.tokenService.generateRefreshToken(user.id);

    return { access, refresh: newRefresh };
  }
}
