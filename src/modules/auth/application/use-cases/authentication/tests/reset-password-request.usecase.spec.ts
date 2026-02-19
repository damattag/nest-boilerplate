import { makeUser } from 'tests/factories/make-user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ITokenRepository } from '@/modules/auth/application/repositories';
import { ITokenService } from '@/modules/auth/application/services';
import { PasswordRecoverRequestUseCase } from '@/modules/auth/application/use-cases';
import { Token } from '@/modules/auth/domain';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { EmailService } from '@/shared/services/email';
import { EnvService } from '@/shared/services/env';

describe('PasswordRecoverRequestUseCase', () => {
  let sut: PasswordRecoverRequestUseCase;
  let usersRepository: IUsersRepository;
  let mailService: EmailService;
  let tokenService: ITokenService;
  let envService: EnvService;
  let tokenRepository: ITokenRepository;

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
    } as unknown as IUsersRepository;

    mailService = {
      send: vi.fn(),
    } as unknown as EmailService;

    tokenService = {
      generateResetPasswordCode: vi.fn().mockReturnValue('reset-code'),
    } as unknown as ITokenService;

    envService = {
      get: vi.fn().mockReturnValue('http://frontend.url'),
    } as unknown as EnvService;

    tokenRepository = {
      create: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITokenRepository;

    sut = new PasswordRecoverRequestUseCase(
      usersRepository,
      mailService,
      tokenService,
      envService,
      tokenRepository,
    );
  });

  it('should be able to request password reset', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);

    await sut.execute({ email: 'john@example.com' });

    expect(usersRepository.findByEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
    });
    expect(tokenService.generateResetPasswordCode).toHaveBeenCalled();
    expect(tokenRepository.create).toHaveBeenCalledWith(expect.any(Token));
    expect(mailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        subject: 'Reset de senha',
      }),
    );
  });

  it('should do nothing if user does not exist', async () => {
    vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);

    await sut.execute({ email: 'non-existing@example.com' });

    expect(tokenService.generateResetPasswordCode).not.toHaveBeenCalled();
    expect(tokenRepository.create).not.toHaveBeenCalled();
    expect(mailService.send).not.toHaveBeenCalled();
  });

  it('should delete token if email sending fails', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    vi.mocked(usersRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(mailService.send).mockRejectedValue(new Error('Email error'));

    await expect(sut.execute({ email: 'john@example.com' })).rejects.toThrow(
      'Email error',
    );

    expect(tokenRepository.delete).toHaveBeenCalled();
  });
});
