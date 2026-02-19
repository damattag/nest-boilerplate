import type { Prisma, Token as PrismaToken } from '@/generated/prisma/client';
import { Token, TokenType } from '@/modules/auth/domain';

export class TokensMapper {
  static toDomain(data: PrismaToken): Token {
    return Token.create({
      id: data.id,
      userId: data.userId,
      type: data.type as TokenType,
      code: data.code,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
    });
  }

  static toPersistence(data: Token): Prisma.TokenUncheckedCreateInput {
    return {
      userId: data.userId,
      type: data.type,
      code: data.code,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
    };
  }
}
