import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases';
import {
  type ResetPasswordBodySchema,
  resetPasswordBodySwaggerSchema,
  resetPasswordBodyValidationPipe,
} from '@/modules/auth/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { Public } from '@/shared/libs/nest/decorators/public.decorator';

@ApiTags(SwaggerTags.AUTH)
@Controller(ApiPaths.AUTH)
@Public()
export class ResetPasswordController {
  constructor(private readonly useCase: ResetPasswordUseCase) {}

  @Patch('/reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiNoContentResponse({
    description: 'Password reset successfully',
  })
  @ApiBody({ schema: resetPasswordBodySwaggerSchema })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(resetPasswordBodyValidationPipe)
    body: ResetPasswordBodySchema,
  ): Promise<void> {
    await this.useCase.execute(body);
  }
}
