import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/shared/database';
import { EmailModule } from '@/shared/services/email';
import { HashModule } from '@/shared/services/hash';
import { IUsersRepository } from './application/repositories';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  ListUsersController,
  UpdateUserController,
} from './infra/controllers';
import { UsersRepository } from './infra/database/repositories';

@Module({
  imports: [DatabaseModule, HashModule, EmailModule],
  controllers: [
    CreateUserController,
    GetUserByIdController,
    ListUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [IUsersRepository],
})
export class UsersModule {}
