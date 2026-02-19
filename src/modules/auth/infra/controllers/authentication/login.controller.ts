import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '@/modules/auth/application/use-cases';
import {
  type LoginBodySchema,
  type LoginResponse,
  loginBodySwaggerSchema,
  loginBodyValidationPipe,
} from '@/modules/auth/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { Public } from '@/shared/libs/nest/decorators/public.decorator';

@ApiTags(SwaggerTags.AUTH)
@Controller(ApiPaths.AUTH)
@Public()
export class LoginController {
  constructor(private readonly useCase: LoginUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiBody({ schema: loginBodySwaggerSchema })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body(loginBodyValidationPipe) body: LoginBodySchema,
  ): Promise<LoginResponse> {
    const { access, refresh } = await this.useCase.execute(body);

    return {
      access,
      refresh,
    };
  }
}
