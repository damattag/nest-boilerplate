import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { ITokenService } from '@/modules/auth/application/services';
import { DatabaseModule } from '@/shared/database';

describe('List Users (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenService: ITokenService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenService = moduleRef.get(ITokenService);

    buildAppConfig(app);

    await app.init();
  });

  test('[GET] /v1/users', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = await tokenService.generateAccessToken(user.id);

    await Promise.all([
      userFactory.makePrismaUser({ name: 'User 1' }),
      userFactory.makePrismaUser({ name: 'User 2' }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/v1/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, page: 1 })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.meta).toEqual(
      expect.objectContaining({
        total: 3,
        page: 1,
      }),
    );
  });
});
