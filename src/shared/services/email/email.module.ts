import { Module } from '@nestjs/common';
import { EnvModule } from '@/shared/services/env';
import { EmailService } from './email.service';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: EmailService,
      useClass: SendgridService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
