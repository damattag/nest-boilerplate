import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { ITokenService } from '@/modules/auth/application/services';
import { DatabaseModule } from '@/shared/database';

describe('Get User By Id (e2e)', () => {
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

  test('[GET] /v1/users/:id', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = await tokenService.generateAccessToken(user.id);

    const response = await request(app.getHttpServer())
      .get(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    );
  });
});
