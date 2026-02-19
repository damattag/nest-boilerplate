import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { IHashService } from '@/shared/services/hash';
import { RegistrationUseCase } from '../registration.usecase';

describe('RegistrationUseCase', () => {
  let sut: RegistrationUseCase;
  let usersRepository: IUsersRepository;
  let hashService: IHashService;

  beforeEach(() => {
    usersRepository = {
      create: vi.fn(),
    } as unknown as IUsersRepository;

    hashService = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
    } as unknown as IHashService;

    sut = new RegistrationUseCase(usersRepository, hashService);
  });

  it('should be able to register a new user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await sut.execute(input);

    expect(hashService.hash).toHaveBeenCalledWith('password123');
    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
        password: 'hashed-password',
      }),
    );
  });

  it('should call usersRepository.create with a User instance', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await sut.execute(input);

    expect(usersRepository.create).toHaveBeenCalledWith(expect.any(User));
  });
});
