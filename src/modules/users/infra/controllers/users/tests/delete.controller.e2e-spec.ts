import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'tests/factories';
import { buildAppConfig } from 'tests/utils/build-app';
import { AppModule } from '@/app.module';
import { ITokenService } from '@/modules/auth/application/services';
import { DatabaseModule, PrismaService } from '@/shared/database';

describe('Delete User (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenService: ITokenService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenService = moduleRef.get(ITokenService);
    prisma = moduleRef.get(PrismaService);

    buildAppConfig(app);

    await app.init();
  });

  test('[DELETE] /v1/users/:id', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = await tokenService.generateAccessToken(user.id);

    const response = await request(app.getHttpServer())
      .delete(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(204);

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(userOnDatabase).toBeNull();
  });
});
