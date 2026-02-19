import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { EnvService } from '@/shared/services/env/env.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(env: EnvService) {
    const adapter = new PrismaPg({ connectionString: env.get('DATABASE_URL') });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();

    Logger.log('📦 Database connected!', 'PrismaService');
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
