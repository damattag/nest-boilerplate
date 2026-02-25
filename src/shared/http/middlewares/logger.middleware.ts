import { randomUUID } from 'node:crypto';
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@/shared/services/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggerService();

  use(request: Request, response: Response, next: NextFunction): void {
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'test') {
      return next();
    }

    const { ip, method, baseUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const requestId = request.headers['x-request-id'] ?? randomUUID();

    const init = Date.now();
    const timestamp = new Date(init).toISOString();

    const data = {
      stage: 'START',
      method,
      url: baseUrl,
      userAgent,
      ip,
      requestId,
      timestamp,
    };

    this.logger.info(data);

    response.on('finish', () => {
      const duration = Date.now() - init;
      const { statusCode } = response;

      data.stage = 'END';
      data['statusCode'] = statusCode;
      data['duration'] = `${duration}ms`;

      this.logger.info(data);
    });

    next();
  }
}
