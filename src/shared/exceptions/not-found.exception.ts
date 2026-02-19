import { HttpStatus } from '@nestjs/common';
import { DefaultException, type ExceptionInput } from './default.exception';

export class NotFoundException extends DefaultException {
  constructor(props: ExceptionInput) {
    super({
      message: props.message,
      code: props.code,
      status: HttpStatus.NOT_FOUND,
      data: props.data,
    });
  }
}
