import { makeUser } from 'tests/factories/make-user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ITokenService } from '@/modules/auth/application/services';
import { LoginUseCase } from '@/modules/auth/application/use-cases';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { InvalidInputException } from '@/shared/exceptions';
import { IHashService } from '@/shared/services/hash';

describe('LoginUseCase', () => {
  let sut: LoginUseCase;
  let usersRepository: IUsersRepository;
  let hashService: IHashService;
  let tokenService: ITokenService;

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
    } as unknown as IUsersRepository;

    hashService = {
      compare: vi.fn(),
    } as unknown as IHashService;

    tokenService = {
      generateAccessToken: vi.fn().mockResolvedValue('access-token'),
      generateRefreshToken: vi.fn().mockResolvedValue('refresh-token'),
    } as unknown as ITokenService;

    sut = new LoginUseCase(usersRepository, hashService, tokenService);
  });

  it('should be able to login with valid credentials', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(hashService.compare).mockResolvedValue(true);

    const result = await sut.execute({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(usersRepository.findByEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
    });
    expect(hashService.compare).toHaveBeenCalledWith(
      'password123',
      'hashed-password',
    );
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(user.id);
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(user.id);
    expect(result).toEqual({
      access: 'access-token',
      refresh: 'refresh-token',
    });
  });

  it('should not be able to login with non-existing email', async () => {
    vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);

    await expect(
      sut.execute({
        email: 'non-existing@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(InvalidInputException);
  });

  it('should not be able to login with invalid password', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(hashService.compare).mockResolvedValue(false);

    await expect(
      sut.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(InvalidInputException);
  });
});
