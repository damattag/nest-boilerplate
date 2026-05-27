import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiQueryParams } from 'nest-swagger-zod';
import { ListUsersUseCase } from '@/modules/users/application/use-cases';
import {
  type ListUsersQueryParamsSchema,
  type ListUsersResponse,
  listUsersQueryParamsSwaggerSchema,
  listUsersQueryParamsValidationPipe,
  listUsersResponseSwaggerSchema,
} from '@/modules/users/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { buildResponseMeta } from '@/shared/utils/build-response-meta';

@ApiTags(SwaggerTags.USERS)
@Controller(ApiPaths.USERS)
@ApiBearerAuth()
export class ListUsersController {
  constructor(private readonly useCase: ListUsersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    schema: listUsersResponseSwaggerSchema,
    description: 'Users retrieved successfully',
  })
  @ApiQueryParams(listUsersQueryParamsSwaggerSchema)
  @HttpCode(HttpStatus.OK)
  async handle(
    @Query(listUsersQueryParamsValidationPipe)
    params: ListUsersQueryParamsSchema,
  ): Promise<ListUsersResponse> {
    const { users, count } = await this.useCase.execute({
      limit: params.limit,
      page: params.page,
      name: params.name,
      email: params.email,
    });

    const meta = buildResponseMeta({
      limit: params.limit,
      listed: users.length,
      page: params.page,
      total: count,
    });

    const data: ListUsersResponse['data'] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      data,
      meta,
    };
  }
}
