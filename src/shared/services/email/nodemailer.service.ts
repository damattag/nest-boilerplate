import { HttpStatus, Injectable } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { DefaultException } from '@/shared/exceptions';
import { EnvService } from '@/shared/services/env';
import { EmailService, SendEmailInput } from './email.service';

@Injectable()
export class NodemailerService implements EmailService {
  private email: string;
  private mailer: Transporter;

  constructor(private readonly env: EnvService) {
    this.email = this.env.get('SMTP_USER');
    this.mailer = createTransport({
      host: this.env.get('SMTP_HOST'),
      port: this.env.get('SMTP_PORT'),
      auth: {
        type: 'OAuth2',
        user: this.env.get('SMTP_USER'),
        clientId: this.env.get('GOOGLE_CLIENT_ID'),
        clientSecret: this.env.get('GOOGLE_CLIENT_SECRET'),
        refreshToken: this.env.get('GOOGLE_REFRESH_TOKEN'),
      },
    });
  }

  async send(input: SendEmailInput): Promise<void> {
    const { to, subject, html } = input;

    try {
      await this.mailer.sendMail({
        to,
        from: this.email,
        subject,
        html,
      });
    } catch (error) {
      throw new DefaultException({
        message: 'Email não enviado',
        code: 'EMAIL_NOT_SENT',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  }
}
