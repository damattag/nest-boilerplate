import { Token } from '@/modules/auth/domain';

export interface FindTokenByIdInput {
  id: string;
}

export interface FindTokenByCodeInput {
  code: string;
}

export interface DeleteTokenInput {
  id: string;
}

export abstract class ITokenRepository {
  abstract create(input: Token): Promise<void>;
  abstract findById(input: FindTokenByIdInput): Promise<Token | null>;
  abstract findByCode(input: FindTokenByCodeInput): Promise<Token | null>;
  abstract delete(input: DeleteTokenInput): Promise<void>;
}
