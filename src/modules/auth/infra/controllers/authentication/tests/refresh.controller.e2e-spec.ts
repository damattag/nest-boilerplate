import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/shared/database';

describe('Refresh (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    buildAppConfig(app);

    await app.init();
  });

  test('[POST] /v1/sessions/refresh', async () => {
    const password = 'Str0ngPassw0rd!';
    const hashedPassword = await hash(password, 8);
    await userFactory.makePrismaUser({
      name: 'John Refresh',
      email: 'john.refresh@example.com',
      password: hashedPassword,
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/v1/sessions')
      .send({
        email: 'john.refresh@example.com',
        password: 'Str0ngPassw0rd!',
      });

    const { refresh } = loginResponse.body;

    const response = await request(app.getHttpServer())
      .post('/v1/sessions/refresh')
      .send({
        refresh_token: refresh,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access');
    expect(response.body).toHaveProperty('refresh');
  });
});
