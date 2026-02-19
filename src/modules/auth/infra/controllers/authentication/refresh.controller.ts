import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshUseCase } from '@/modules/auth/application/use-cases';
import {
  type RefreshBodySchema,
  type RefreshResponse,
  refreshBodySwaggerSchema,
  refreshBodyValidationPipe,
} from '@/modules/auth/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { Public } from '@/shared/libs/nest/decorators/public.decorator';

@ApiTags(SwaggerTags.AUTH)
@Controller(ApiPaths.AUTH)
@Public()
export class RefreshController {
  constructor(private readonly useCase: RefreshUseCase) {}

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh user access token' })
  @ApiOkResponse({
    description: 'User access token refreshed successfully',
  })
  @ApiBody({ schema: refreshBodySwaggerSchema })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body(refreshBodyValidationPipe) body: RefreshBodySchema,
  ): Promise<RefreshResponse> {
    const { access, refresh } = await this.useCase.execute({
      refreshToken: body.refresh_token,
    });

    return {
      access,
      refresh,
    };
  }
}
