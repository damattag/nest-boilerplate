import { Injectable } from '@nestjs/common';
import type {
  DeleteTokenInput,
  FindTokenByCodeInput,
  FindTokenByIdInput,
  ITokenRepository,
} from '@/modules/auth/application/repositories';
import { type Token } from '@/modules/auth/domain';
import { TokensMapper } from '@/modules/auth/infra/database/mappers';
import { PrismaService } from '@/shared/database';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: Token): Promise<void> {
    const data = TokensMapper.toPersistence(input);

    await this.prisma.token.create({
      data,
    });
  }

  async findById(input: FindTokenByIdInput): Promise<Token | null> {
    const { id } = input;

    const token = await this.prisma.token.findUnique({
      where: {
        id,
      },
    });

    if (!token) {
      return null;
    }

    return TokensMapper.toDomain(token);
  }

  async delete(input: DeleteTokenInput): Promise<void> {
    const { id } = input;

    await this.prisma.token.delete({
      where: {
        id,
      },
    });
  }

  async findByCode(input: FindTokenByCodeInput): Promise<Token | null> {
    const { code } = input;

    const token = await this.prisma.token.findUnique({
      where: {
        code,
      },
    });

    if (!token) {
      return null;
    }

    return TokensMapper.toDomain(token);
  }
}
