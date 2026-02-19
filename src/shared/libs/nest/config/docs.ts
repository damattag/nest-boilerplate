import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { envSchema } from '@/shared/services/env';
import type { AppEnvironment } from '@/shared/types/global';

type GenerateSwagerConfigInput = {
  apiPort: number;
  environment: AppEnvironment;
  jsonDocumentUrl: string;
  host?: string;
};

export enum SwaggerTags {
  PROGRAMS = 'Programs',
}

export const generateSwaggerConfig = (input: GenerateSwagerConfigInput) => {
  const {
    apiPort,
    environment,
    jsonDocumentUrl,
    host = 'http://localhost',
  } = input;

  const API_NAME = 'Platform Backend Boilerplate API';
  const API_DESCRIPTION = 'API for Platform Backend Boilerplate';
  const API_VERSION = '1.0';

  const serverUrl = `${host}:${apiPort}`;

  const documentation = new DocumentBuilder()
    .setTitle(API_NAME)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .addServer(serverUrl, environment)
    .addBearerAuth()
    .setExternalDoc(API_NAME, `${serverUrl}${jsonDocumentUrl}`)
    .build();

  return documentation;
};

export function openApi(app: INestApplication) {
  const JSON_DOCUMENT_URL = '/docs/json';
  const DOCUMENTATION_PATH = 'docs';

  const env = envSchema.parse(process.env);

  const config = generateSwaggerConfig({
    apiPort: env.SERVER_PORT,
    environment: env.NODE_ENV,
    jsonDocumentUrl: JSON_DOCUMENT_URL,
  });

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: JSON_DOCUMENT_URL,
  };

  SwaggerModule.setup(DOCUMENTATION_PATH, app, document, customOptions);
}
