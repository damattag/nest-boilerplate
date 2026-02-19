import { makeUser } from 'tests/factories/make-user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ITokenRepository } from '@/modules/auth/application/repositories';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases';
import { Token } from '@/modules/auth/domain';
import { IUsersRepository } from '@/modules/users/application/repositories';
import {
  InvalidInputException,
  UnauthorizedException,
} from '@/shared/exceptions';
import { IHashService } from '@/shared/services/hash';

describe('ResetPasswordUseCase', () => {
  let sut: ResetPasswordUseCase;
  let usersRepository: IUsersRepository;
  let hashService: IHashService;
  let tokenRepository: ITokenRepository;

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
      update: vi.fn(),
    } as unknown as IUsersRepository;

    hashService = {
      hash: vi.fn().mockResolvedValue('new-hashed-password'),
    } as unknown as IHashService;

    tokenRepository = {
      findByCode: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITokenRepository;

    sut = new ResetPasswordUseCase(
      usersRepository,
      hashService,
      tokenRepository,
    );
  });

  it('should be able to reset password', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'old-hashed-password',
    });

    const token = Token.create({
      code: 'valid-code',
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      type: 'reset_password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(tokenRepository.findByCode).mockResolvedValue(token);

    await sut.execute({
      email: 'john@example.com',
      code: 'valid-code',
      password: 'new-password123',
    });

    expect(usersRepository.findByEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
    });
    expect(tokenRepository.findByCode).toHaveBeenCalledWith({
      code: 'valid-code',
    });
    expect(hashService.hash).toHaveBeenCalledWith('new-password123');
    expect(usersRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'new-hashed-password',
      }),
    );
    expect(tokenRepository.delete).toHaveBeenCalledWith({ id: token.id });
  });

  it('should not be able to reset password if user does not exist', async () => {
    vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);

    await expect(
      sut.execute({
        email: 'non-existing@example.com',
        code: 'any-code',
        password: 'any-password',
      }),
    ).rejects.toThrow(InvalidInputException);
  });

  it('should not be able to reset password if code is invalid', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'old-hashed-password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(tokenRepository.findByCode).mockResolvedValue(null);

    await expect(
      sut.execute({
        email: 'john@example.com',
        code: 'invalid-code',
        password: 'any-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should not be able to reset password if code belongs to another user', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'old-hashed-password',
    });

    const token = Token.create({
      code: 'valid-code',
      userId: 'another-user-id',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      type: 'reset_password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(tokenRepository.findByCode).mockResolvedValue(token);

    await expect(
      sut.execute({
        email: 'john@example.com',
        code: 'valid-code',
        password: 'any-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
