import { HttpStatus, Injectable } from '@nestjs/common';
import sendgrid from '@sendgrid/mail';
import { DefaultException } from '@/shared/exceptions';
import { EnvService } from '@/shared/services/env';
import { EmailService, SendEmailInput } from './email.service';

@Injectable()
export class SendgridService implements EmailService {
  private apiKey: string;
  private email: string;

  private mailer: sendgrid.MailService;

  constructor(private readonly env: EnvService) {
    this.apiKey = this.env.get('SENDGRID_API_KEY');
    this.email = this.env.get('SENDGRID_EMAIL');

    this.mailer = sendgrid;
    this.mailer.setApiKey(this.apiKey);
  }

  async send(input: SendEmailInput): Promise<void> {
    const { to, subject, html } = input;

    try {
      await this.mailer.send({
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
