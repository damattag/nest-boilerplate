import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUserUseCase } from '@/modules/users/application/use-cases';
import {
  type DeleteUserParamsSchema,
  type DeleteUserResponse,
  deleteUserParamsValidationPipe,
} from '@/modules/users/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';

@ApiTags(SwaggerTags.USERS)
@Controller(ApiPaths.USERS)
@ApiBearerAuth()
export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @ApiParam({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param(deleteUserParamsValidationPipe)
    params: DeleteUserParamsSchema,
  ): Promise<DeleteUserResponse> {
    await this.useCase.execute(params);
  }
}
