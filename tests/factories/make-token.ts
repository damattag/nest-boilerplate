import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Token, TokenProps } from '@/modules/auth/domain';
import { TokensMapper } from '@/modules/auth/infra/database/mappers';
import { PrismaService } from '@/shared/database';

type TokenInput = Partial<TokenProps> & Required<Pick<TokenProps, 'userId'>>;

export function makeToken(overrides: TokenInput): Token {
  return Token.create({
    id: faker.string.uuid(),
    code: faker.string.numeric({ length: 6 }),
    type: 'reset_password',
    expiresAt: faker.date.future({ refDate: new Date() }),
    ...overrides,
  });
}

@Injectable()
export class TokenFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaToken(data: TokenInput): Promise<Token> {
    const token = makeToken(data);

    await this.prisma.token.create({
      data: TokensMapper.toPersistence(token),
    });

    return token;
  }
}
