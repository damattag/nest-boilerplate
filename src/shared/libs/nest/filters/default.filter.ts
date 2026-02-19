import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';
import { DefaultException } from '@/shared/exceptions/default.exception';
import { type ExceptionLogs, LoggerService } from '@/shared/services/logger';

@Catch(DefaultException)
export class DefaultFilter implements ExceptionFilter {
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService();
  }

  catch(exception: DefaultException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.status;
    const timestamp = new Date().toISOString();
    const message = exception.message;
    const code = exception.code;
    const data = exception.data;

    const exceptionObj: ExceptionLogs = {
      status,
      code,
      message,
      data,
    };

    this.logger.error(ctx.getRequest(), exceptionObj);

    response.status(status).json({
      status,
      code,
      message,
      data,
      timestamp,
    });
  }
}
