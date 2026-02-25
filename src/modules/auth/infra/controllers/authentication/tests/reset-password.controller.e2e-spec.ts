import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TokenFactory, UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { DatabaseModule, PrismaService } from '@/shared/database';

describe('Reset Password (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TokenFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);

    buildAppConfig(app);

    await app.init();
  });

  test('[PATCH] /v1/sessions/reset-password', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Patch',
      email: 'john.patch@example.com',
      password: 'old-password',
    });

    const code = '123456';
    await tokenFactory.makePrismaToken({
      code,
      userId: user.id,
    });

    const response = await request(app.getHttpServer())
      .patch('/v1/sessions/reset-password')
      .send({
        email: 'john.patch@example.com',
        code,
        password: 'NewStr0ngPassw0rd!',
      });

    expect(response.status).toBe(204);

    const loginResponse = await request(app.getHttpServer())
      .post('/v1/sessions')
      .send({
        email: 'john.patch@example.com',
        password: 'NewStr0ngPassw0rd!',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('access');

    const tokenOnDatabase = await prisma.token.findUnique({
      where: { code },
    });

    expect(tokenOnDatabase).toBeNull();
  });
});
