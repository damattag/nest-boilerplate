import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PasswordRecoverRequestUseCase } from '@/modules/auth/application/use-cases';
import {
  type ResetPasswordRequestBodySchema,
  resetPasswordRequestBodySwaggerSchema,
  resetPasswordRequestBodyValidationPipe,
} from '@/modules/auth/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { Public } from '@/shared/libs/nest/decorators/public.decorator';

@ApiTags(SwaggerTags.AUTH)
@Controller(ApiPaths.AUTH)
@Public()
export class ResetPasswordRequestController {
  constructor(private readonly useCase: PasswordRecoverRequestUseCase) {}

  @Post('/reset-password-request')
  @ApiOperation({ summary: 'Reset password request' })
  @ApiNoContentResponse({
    description: 'Reset password request successfully',
  })
  @ApiBody({ schema: resetPasswordRequestBodySwaggerSchema })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(resetPasswordRequestBodyValidationPipe)
    body: ResetPasswordRequestBodySchema,
  ): Promise<void> {
    await this.useCase.execute(body);
  }
}
