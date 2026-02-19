import { makeUser } from 'tests/factories';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases';
import { InvalidInputException } from '@/shared/exceptions';

describe('GetUserByIdUseCase', () => {
  let sut: GetUserByIdUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as unknown as IUsersRepository;

    sut = new GetUserByIdUseCase(usersRepository);
  });

  it('should be able to get a user by id', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findById).mockResolvedValue(user);

    const result = await sut.execute({ id: user.id });

    expect(usersRepository.findById).toHaveBeenCalledWith({ id: user.id });
    expect(result.user).toEqual(user);
  });

  it('should not be able to get a non-existing user', async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(null);

    await expect(sut.execute({ id: 'non-existing-id' })).rejects.toThrow(
      InvalidInputException,
    );
  });
});
