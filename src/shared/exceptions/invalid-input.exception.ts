import { HttpStatus } from '@nestjs/common';
import { DefaultException, type ExceptionInput } from './default.exception';

export class InvalidInputException extends DefaultException {
  constructor(props: ExceptionInput) {
    super({
      message: props.message,
      code: props.code,
      status: HttpStatus.BAD_REQUEST,
      data: props.data,
    });
  }
}
