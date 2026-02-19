import { UserPayload } from '@/modules/auth/infra/strategies/bearer';

export abstract class ITokenService {
  abstract generateAccessToken(userId: string): Promise<string>;
  abstract generateRefreshToken(userId: string): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<UserPayload>;
  abstract verifyRefreshToken(token: string): Promise<UserPayload>;
  abstract generateResetPasswordCode(): string;
}
