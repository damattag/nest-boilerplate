import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrationUseCase } from '@/modules/auth/application/use-cases';
import {
  RegistrationBodyDto,
  type RegistrationResponse,
  registrationBodySwaggerSchema,
} from '@/modules/auth/infra/dtos';
import {
  ApiPaths,
  SwaggerTags,
} from '@/shared/libs/nest/config/swagger-constants';
import { Public } from '@/shared/libs/nest/decorators/public.decorator';

@ApiTags(SwaggerTags.AUTH)
@Controller(`${ApiPaths.AUTH}/registration`)
@Public()
export class RegistrationController {
  constructor(private readonly useCase: RegistrationUseCase) {}

  @Post()
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiBody({ schema: registrationBodySwaggerSchema })
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body() body: RegistrationBodyDto,
  ): Promise<RegistrationResponse> {
    await this.useCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    });
  }
}
