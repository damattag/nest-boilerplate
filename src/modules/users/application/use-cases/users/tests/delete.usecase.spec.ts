import { makeUser } from 'tests/factories';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { DeleteUserUseCase } from '@/modules/users/application/use-cases';
import { InvalidInputException } from '@/shared/exceptions';

describe('DeleteUserUseCase', () => {
  let sut: DeleteUserUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as IUsersRepository;

    sut = new DeleteUserUseCase(usersRepository);
  });

  it('should be able to delete a user', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findById).mockResolvedValue(user);

    await sut.execute({ id: user.id });

    expect(usersRepository.findById).toHaveBeenCalledWith({ id: user.id });
    expect(usersRepository.delete).toHaveBeenCalledWith({ id: user.id });
  });

  it('should not be able to delete a non-existing user', async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(null);

    await expect(sut.execute({ id: 'non-existing-id' })).rejects.toThrow(
      InvalidInputException,
    );
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });
});
