import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database';

describe('Registration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    buildAppConfig(app);

    await app.init();
  });

  test('[POST] /v1/sessions/registration', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/sessions/registration')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Str0ngPassw0rd!',
      });

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
