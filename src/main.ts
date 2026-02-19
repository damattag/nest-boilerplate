import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { corsOptions } from '@/shared/libs/nest/config/cors';
import { openApi } from '@/shared/libs/nest/config/docs';
import { EnvService } from '@/shared/services/env';
import { AppModule } from './app.module';
import { DatabaseFilter } from './shared/libs/nest/filters/database.filter';
import { DefaultFilter } from './shared/libs/nest/filters/default.filter';
import { ZodFilter } from './shared/libs/nest/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(EnvService);

  const appEnv = config.get('NODE_ENV');
  const port = config.get('SERVER_PORT');

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  if (appEnv !== 'production') {
    openApi(app);
  }

  app.enableCors(corsOptions);

  app.useGlobalFilters(
    new DefaultFilter(),
    new ZodFilter(),
    new DatabaseFilter(),
  );

  await app.listen(port, () => {
    const message =
      appEnv === 'production'
        ? `🚀 Server is running on port ${port}`
        : `🚀 Server docs is running on http://localhost:${port}/docs`;

    Logger.log(message);
  });
}
bootstrap();
