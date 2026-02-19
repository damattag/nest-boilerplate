import { HttpStatus } from '@nestjs/common';
import { DefaultException, type ExceptionInput } from './default.exception';

export class ForbiddenException extends DefaultException {
  constructor(props: ExceptionInput) {
    super({
      message: props.message,
      code: props.code,
      status: HttpStatus.FORBIDDEN,
      data: props.data,
    });
  }
}
