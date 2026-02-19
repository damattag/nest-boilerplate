import { UnauthorizedException } from '@nestjs/common';
import { makeUser } from 'tests/factories';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ITokenService } from '@/modules/auth/application/services';
import { RefreshUseCase } from '@/modules/auth/application/use-cases';
import { IUsersRepository } from '@/modules/users/application/repositories';

describe('RefreshUseCase', () => {
  let sut: RefreshUseCase;
  let usersRepository: IUsersRepository;
  let tokenService: ITokenService;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as unknown as IUsersRepository;

    tokenService = {
      verifyRefreshToken: vi.fn(),
      generateAccessToken: vi.fn().mockResolvedValue('access-token'),
      generateRefreshToken: vi.fn().mockResolvedValue('new-refresh-token'),
    } as unknown as ITokenService;

    sut = new RefreshUseCase(usersRepository, tokenService);
  });

  it('should be able to refresh token', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
      sub: user.id,
    });
    vi.mocked(usersRepository.findById).mockResolvedValue(user);

    const result = await sut.execute({
      refreshToken: 'old-refresh-token',
    });

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      'old-refresh-token',
    );
    expect(usersRepository.findById).toHaveBeenCalledWith({ id: user.id });
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(user.id);
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(user.id);
    expect(result).toEqual({
      access: 'access-token',
      refresh: 'new-refresh-token',
    });
  });

  it('should not be able to refresh token if user does not exist', async () => {
    vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
      sub: 'non-existing-id',
    });
    vi.mocked(usersRepository.findById).mockResolvedValue(null);

    await expect(
      sut.execute({
        refreshToken: 'valid-token-but-no-user',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
