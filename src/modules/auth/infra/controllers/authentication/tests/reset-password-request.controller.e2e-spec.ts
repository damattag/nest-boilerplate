import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { DatabaseModule, PrismaService } from '@/shared/database';
import { EmailService } from '@/shared/services/email';

describe('Reset Password Request (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  const mockEmailService = {
    send: vi.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);

    buildAppConfig(app);

    await app.init();
  });

  test('[POST] /v1/sessions/reset-password-request', async () => {
    await userFactory.makePrismaUser({
      name: 'John Reset',
      email: 'john.reset@example.com',
      password: 'any-password',
    });

    const response = await request(app.getHttpServer())
      .post('/v1/sessions/reset-password-request')
      .send({
        email: 'john.reset@example.com',
      });

    expect(response.status).toBe(204);

    const tokenOnDatabase = await prisma.token.findFirst({
      where: {
        type: 'reset_password',
        user: {
          email: 'john.reset@example.com',
        },
      },
    });

    expect(tokenOnDatabase).toBeTruthy();
    expect(mockEmailService.send).toHaveBeenCalled();
  });
});
