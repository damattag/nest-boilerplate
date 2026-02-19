import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod/v4';
import { type ExceptionLogs, LoggerService } from '@/shared/services/logger';
import { removeSensitiveData } from '@/shared/utils/remove-sensitive-data';

@Catch(ZodError)
export class ZodFilter implements ExceptionFilter {
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService();
  }

  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.BAD_REQUEST;

    const errorObj = {};
    for (const error of exception.issues) {
      errorObj[error.path.join('.')] = error.message;
    }
    const message = JSON.stringify(errorObj, null, 2);

    const body = request.body ? removeSensitiveData(request.body) : undefined;
    const params = request.params
      ? removeSensitiveData(request.params)
      : undefined;
    const queryRaw = request.query
      ? removeSensitiveData(request.query)
      : undefined;

    const code = 'ZOD_ERROR';

    const exceptionObj: ExceptionLogs = {
      status,
      code,
      message,
      data: {},
    };

    this.logger.error(ctx.getRequest(), exceptionObj);

    return response.status(status).json({
      status,
      code,
      message,
      data: {
        body,
        params,
        queryRaw,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
