import { makeUser } from 'tests/factories';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { ListUsersUseCase } from '@/modules/users/application/use-cases';

describe('ListUsersUseCase', () => {
  let sut: ListUsersUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = {
      list: vi.fn(),
      count: vi.fn(),
    } as unknown as IUsersRepository;

    sut = new ListUsersUseCase(usersRepository);
  });

  it('should be able to list users', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.list).mockResolvedValue([user]);
    vi.mocked(usersRepository.count).mockResolvedValue(1);

    const input = {
      page: 1,
      limit: 10,
    };

    const result = await sut.execute(input);

    expect(usersRepository.list).toHaveBeenCalledWith(input);
    expect(usersRepository.count).toHaveBeenCalledWith(input);
    expect(result.users).toEqual([user]);
    expect(result.count).toEqual(1);
  });
});
