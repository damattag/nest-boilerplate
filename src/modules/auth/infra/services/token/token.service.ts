import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@/modules/auth/application/services';
import { UserPayload } from '@/modules/auth/infra/strategies/bearer';
import { EnvService } from '@/shared/services/env';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  generateResetPasswordCode(): string {
    return randomBytes(6).toString('hex');
  }

  async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: '1d',
        algorithm: 'HS256',
        secret: this.envService.get('JWT_ACCESS_SECRET'),
      },
    );
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: '7d',
        algorithm: 'HS256',
        secret: this.envService.get('JWT_REFRESH_SECRET'),
      },
    );
  }

  async verifyAccessToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync(token, {
      algorithms: ['HS256'],
      secret: this.envService.get('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync(token, {
      algorithms: ['HS256'],
      secret: this.envService.get('JWT_REFRESH_SECRET'),
    });
  }
}
