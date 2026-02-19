import { Module } from '@nestjs/common';
import { EnvModule } from '@/shared/services/env/env.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [EnvModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
