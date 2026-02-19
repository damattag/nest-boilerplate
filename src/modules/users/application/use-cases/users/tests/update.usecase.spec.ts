import { makeUser } from 'tests/factories';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { UpdateUserUseCase } from '@/modules/users/application/use-cases';
import { InvalidInputException } from '@/shared/exceptions';

describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as IUsersRepository;

    sut = new UpdateUserUseCase(usersRepository);
  });

  it('should be able to update a user', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findById).mockResolvedValue(user);

    await sut.execute({
      id: user.id,
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(usersRepository.findById).toHaveBeenCalledWith({ id: user.id });
    expect(usersRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    );
  });

  it('should not be able to update a non-existing user', async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(null);

    await expect(
      sut.execute({ id: 'non-existing-id', name: 'Jane Doe' }),
    ).rejects.toThrow(InvalidInputException);
    expect(usersRepository.update).not.toHaveBeenCalled();
  });
});
