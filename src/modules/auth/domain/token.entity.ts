import { randomUUID } from 'node:crypto';

export interface TokenProps {
  id: string;
  userId: string;
  code: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
}

export const TokenType = ['reset_password'] as const;
export type TokenType = (typeof TokenType)[number];

type CreateTokenInput = Optional<TokenProps, 'createdAt' | 'id'>;

export class Token implements TokenProps {
  id: string;
  userId: string;
  code: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;

  protected constructor(props: TokenProps) {
    Object.assign(this, props);
  }

  static create(props: CreateTokenInput): Token {
    return new Token({
      ...props,
      id: props.id ?? randomUUID(),
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
