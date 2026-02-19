import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserUseCase } from '@/modules/users/application/use-cases';
import {
  type CreateUserBodySchema,
  type CreateUserResponse,
  createUserBodySwaggerSchema,
  createUserBodyValidationPipe,
} from '@/modules/users/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';

@ApiTags(SwaggerTags.USERS)
@Controller(ApiPaths.USERS)
@ApiBearerAuth()
export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBody({ schema: createUserBodySwaggerSchema })
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(createUserBodyValidationPipe) body: CreateUserBodySchema,
  ): Promise<CreateUserResponse> {
    await this.useCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    });
  }
}
