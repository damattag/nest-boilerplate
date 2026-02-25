import { INestApplication, VersioningType } from '@nestjs/common';
import { DatabaseFilter } from '@/shared/libs/nest/filters/database.filter';
import { DefaultFilter } from '@/shared/libs/nest/filters/default.filter';
import { ZodFilter } from '@/shared/libs/nest/filters/zod.filter';

export function buildAppConfig(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalFilters(
    new DefaultFilter(),
    new ZodFilter(),
    new DatabaseFilter(),
  );
}
