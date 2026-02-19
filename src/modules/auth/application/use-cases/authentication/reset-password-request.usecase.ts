import { Injectable } from '@nestjs/common';
import { ITokenService } from '@/modules/auth/application/services';
import { Token } from '@/modules/auth/domain';
import { IUsersRepository } from '@/modules/users/application/repositories';
import { EmailService } from '@/shared/services/email';
import { EnvService } from '@/shared/services/env';
import { ITokenRepository } from '../../repositories';

interface PasswordRecoverRequestUseCaseRequest {
  email: string;
}

type PasswordRecoverRequestUseCaseResponse = void;

@Injectable()
export class PasswordRecoverRequestUseCase {
  private frontendUrl: string;

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly mailService: EmailService,
    private readonly tokenService: ITokenService,
    private readonly envService: EnvService,
    private readonly tokenRepository: ITokenRepository,
  ) {
    this.frontendUrl = this.envService.get('FRONTEND_URL');
  }

  async execute(
    input: PasswordRecoverRequestUseCaseRequest,
  ): Promise<PasswordRecoverRequestUseCaseResponse> {
    const { email } = input;

    const user = await this.usersRepository.findByEmail({
      email,
    });

    if (!user) {
      return;
    }

    const code = this.tokenService.generateResetPasswordCode();

    const token = Token.create({
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      type: 'reset_password',
      userId: user.id,
    });

    const html = `<p>A plataforma Bet Metrica recebeu uma solicitação para recuperar a senha do email ${user.email}.</p>
    <p>Para refefinir sua senha, siga o link: ${this.frontendUrl}/reset-password?code=${code}&email=${user.email}</p>
    <p>A segurança de suas informações é importante para nós.</p>
    <p>Nunca compartilhe sua senha com ninguém.</p>
    <p>Se você suspeitar de atividade fraudulenta em sua conta, entre em contato conosco imediatamente.</p>`;

    await this.tokenRepository.create(token);

    try {
      await this.mailService.send({
        to: user.email,
        subject: 'Reset de senha',
        html,
      });
    } catch (error) {
      await this.tokenRepository.delete({
        id: token.id,
      });

      throw error;
    }
  }
}
