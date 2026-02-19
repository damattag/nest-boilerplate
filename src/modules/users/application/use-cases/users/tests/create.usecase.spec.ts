import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { User } from '@/modules/users/domain';
import { IHashService } from '@/shared/services/hash';
import { CreateUserUseCase } from '../create.usecase';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let hashService: IHashService;

  beforeEach(() => {
    usersRepository = {
      create: vi.fn(),
    } as unknown as IUsersRepository;

    hashService = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
    } as unknown as IHashService;

    sut = new CreateUserUseCase(usersRepository, hashService);
  });

  it('should be able to create a new user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await sut.execute(input);

    expect(hashService.hash).toHaveBeenCalledWith('password123');
    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
      }),
    );
    expect(usersRepository.create).toHaveBeenCalledWith(expect.any(User));
  });
});
