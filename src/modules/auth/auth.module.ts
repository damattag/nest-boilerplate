import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/modules/users/users.module';
import { DatabaseModule } from '@/shared/database';
import { EmailModule } from '@/shared/services/email';
import { EnvModule } from '@/shared/services/env';
import { HashModule } from '@/shared/services/hash';
import { ITokenRepository } from './application/repositories';
import { ITokenService } from './application/services';
import {
  LoginUseCase,
  PasswordRecoverRequestUseCase,
  RefreshUseCase,
  RegistrationUseCase,
  ResetPasswordUseCase,
} from './application/use-cases';
import {
  LoginController,
  RefreshController,
  RegistrationController,
  ResetPasswordController,
  ResetPasswordRequestController,
} from './infra/controllers';
import { TokenRepository } from './infra/database/repositories';
import { TokenService } from './infra/services';
import { JwtAuthGuard } from './infra/strategies/bearer/jwt.guard';
import { JwtStrategy } from './infra/strategies/bearer/jwt.strategy';

@Module({
  imports: [
    EnvModule,
    UsersModule,
    HashModule,
    EmailModule,
    DatabaseModule,

    PassportModule,
    JwtModule,
  ],
  controllers: [
    LoginController,
    RegistrationController,
    RefreshController,
    ResetPasswordRequestController,
    ResetPasswordController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: ITokenService,
      useClass: TokenService,
    },
    {
      provide: ITokenRepository,
      useClass: TokenRepository,
    },
    JwtStrategy,

    LoginUseCase,
    RefreshUseCase,
    RegistrationUseCase,
    PasswordRecoverRequestUseCase,
    ResetPasswordUseCase,
  ],
})
export class AuthModule {}
