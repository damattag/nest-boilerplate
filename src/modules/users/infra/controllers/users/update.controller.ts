import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserUseCase } from '@/modules/users/application/use-cases';
import {
  type UpdateUserBodySchema,
  type UpdateUserParamsSchema,
  type UpdateUserResponse,
  updateUserBodySwaggerSchema,
  updateUserBodyValidationPipe,
  updateUserParamsValidationPipe,
} from '@/modules/users/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';

@ApiTags(SwaggerTags.USERS)
@Controller(ApiPaths.USERS)
@ApiBearerAuth()
export class UpdateUserController {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiNoContentResponse({
    description: 'User updated successfully',
  })
  @ApiParam({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiBody({
    schema: updateUserBodySwaggerSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param(updateUserParamsValidationPipe)
    params: UpdateUserParamsSchema,
    @Body(updateUserBodyValidationPipe)
    body: UpdateUserBodySchema,
  ): Promise<UpdateUserResponse> {
    await this.useCase.execute({
      id: params.id,
      name: body.name,
      email: body.email,
    });
  }
}
