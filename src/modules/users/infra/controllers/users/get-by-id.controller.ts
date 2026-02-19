import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases';
import {
  type GetUserByIdParamsSchema,
  type GetUserByIdResponse,
  getUserByIdParamsValidationPipe,
  getUserByIdResponseSwaggerSchema,
} from '@/modules/users/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';

@ApiTags(SwaggerTags.USERS)
@Controller(ApiPaths.USERS)
@ApiBearerAuth()
export class GetUserByIdController {
  constructor(private readonly useCase: GetUserByIdUseCase) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiOkResponse({
    schema: getUserByIdResponseSwaggerSchema,
    description: 'User details retrieved successfully',
  })
  @ApiParam({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
  })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param(getUserByIdParamsValidationPipe)
    params: GetUserByIdParamsSchema,
  ): Promise<GetUserByIdResponse> {
    const { user } = await this.useCase.execute(params);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
