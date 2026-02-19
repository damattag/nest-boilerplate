import { HttpStatus } from '@nestjs/common';
import { DefaultException, type ExceptionInput } from './default.exception';

export class UnauthorizedException extends DefaultException {
  constructor(props: ExceptionInput) {
    super({
      message: props.message,
      code: props.code,
      status: HttpStatus.UNAUTHORIZED,
      data: props.data,
    });
  }
}
