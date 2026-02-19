import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { removeSensitiveData } from '@/shared/utils/remove-sensitive-data';
import { isValidObject } from '@/shared/utils/valid-object';
import { logger } from './winston.config';

export interface ExceptionLogs {
  status: number;
  code: string;
  message: string;
  data: unknown;
  stack?: string;
}

@Injectable()
export class LoggerService {
  error(req: Request, exception: ExceptionLogs) {
    const agent: string = req.headers['user-agent'] ?? 'UNKNOWN_AGENT';
    const ip: string =
      req.headers['cf-connecting-ip']?.[0] ?? req.ip ?? 'UNKNOWN_IP';

    const timestamp = new Date().toISOString();

    const url = this.urlNormalize(req, req.originalUrl);

    const body = isValidObject(req.body)
      ? removeSensitiveData(req.body)
      : undefined;
    const params = isValidObject(req.params)
      ? removeSensitiveData(req.params)
      : undefined;
    const query = isValidObject(req.query)
      ? removeSensitiveData(req.query)
      : undefined;

    const devData = {
      level: 'ERROR',
      timestamp,
      method: req.method,
      url,
      status: exception.status,
      request: {
        body,
        params,
        query,
      },
      exception: {
        status: exception.status,
        code: exception.code,
        message: exception.message,
        data: exception.data,
        stack: exception.stack,
      },
      ip,
      agent,
    };

    const prodData = {
      url,
      request: {
        body,
        params,
        query,
      },
      exception: {
        status: exception.status,
        code: exception.code,
        message: exception.message,
        data: exception.data,
        stack: exception.stack,
      },
    };

    const env = process.env.NODE_ENV;

    const isProduction = env === 'production';

    const data = isProduction ? prodData : devData;

    const dataString = JSON.stringify(data, null, 2);

    logger.error(dataString);
  }

  info(input: unknown) {
    const isObject = isValidObject(input);

    let dataString: string;

    const timestamp = new Date().toISOString();

    if (isObject) {
      const keys = Object.keys(input);

      const hasTimestamp = keys.includes('timestamp');

      if (!hasTimestamp) {
        input['timestamp'] = timestamp;
      }

      dataString = JSON.stringify({ ...input }, null, 2);
      logger.info(dataString);
      return;
    }

    dataString = JSON.stringify({ data: input, timestamp }, null, 2);

    logger.info(dataString);
  }

  private urlNormalize(req: Request, url: string) {
    const pathKeys = Object.keys(req.params);
    const pathValues = Object.values(req.params);
    url = decodeURIComponent(url.split('?')[0]);

    for (let i = 0; i < pathKeys.length; i++) {
      const key = pathKeys[i];
      const value = pathValues[i];

      url = url.replace(value, `:${key}`);
    }

    return url;
  }
}
