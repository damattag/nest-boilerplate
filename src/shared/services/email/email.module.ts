import { Module } from '@nestjs/common';
import { EnvModule } from '@/shared/services/env';
import { EmailService } from './email.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: EmailService,
      useClass: NodemailerService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
