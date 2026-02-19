import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@/generated/prisma/internal/prismaNamespace';
import { type ExceptionLogs, LoggerService } from '@/shared/services/logger';

interface PrismaErrorMapping {
  status: number;
  message: string;
}

const PRISMA_ERROR_MAPPING: Record<string, PrismaErrorMapping> = {
  // Connection and authentication (config/infra errors)
  P1000: { status: 503, message: 'Authentication failed against database.' },
  P1001: { status: 503, message: "Can't reach database server." },
  P1002: { status: 503, message: 'Database timeout.' },
  P1003: { status: 503, message: 'Database does not exist.' },
  P1008: { status: 503, message: 'Operation timed out.' },
  P1009: { status: 503, message: 'Database already exists.' },
  P1010: { status: 503, message: 'Access denied to database.' },
  P1011: { status: 503, message: 'TLS connection error.' },

  // Schema/validation (config errors)
  P1012: { status: 500, message: 'Prisma schema invalid.' },
  P1013: { status: 500, message: 'Invalid database connection string.' },
  P1014: { status: 503, message: 'Table/model does not exist.' },
  P1015: { status: 503, message: 'Database version incompatible.' },
  P1016: {
    status: 400,
    message: 'Incorrect number of parameters in raw query.',
  },
  P2021: { status: 503, message: 'Table does not exist in database.' },
  P2022: { status: 503, message: 'Column does not exist in database.' },

  // Query/data errors (P2xxx - most common in runtime)
  P2000: { status: 422, message: 'Value too long for field.' },
  P2001: { status: 404, message: 'Record not found.' },
  P2002: { status: 409, message: 'Unique constraint violation.' },
  P2003: { status: 422, message: 'Foreign key constraint violation.' },
  P2004: { status: 422, message: 'Database constraint violation.' },
  P2005: { status: 422, message: 'Invalid value in database field.' },
  P2006: { status: 400, message: 'Invalid provided value for field.' },
  P2007: { status: 400, message: 'Data validation error.' },
  P2011: { status: 422, message: 'NULL constraint violation.' },
  P2023: { status: 500, message: 'Inconsistent column data.' },
  P2024: { status: 503, message: 'Connection pool timeout.' },
  P2025: {
    status: 412,
    message: 'Operation failed due to missing dependency.',
  },

  // Migrations (P3xxx)
  P3000: { status: 500, message: 'Failed to create database.' },
  P3002: { status: 500, message: 'Migration was rolled back.' },
  P3004: { status: 500, message: 'Attempt to modify system database.' },
  P3005: { status: 500, message: 'Database is not empty. Use baseline.' },
  P3006: { status: 500, message: 'Migration failed (shadow DB).' },
  P3008: { status: 409, message: 'Migration already applied.' },
  P3009: { status: 500, message: 'Previous migrations failed.' },
};

@Catch(PrismaClientKnownRequestError)
export class DatabaseFilter implements ExceptionFilter {
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService();
  }

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const code = exception.code;
    const mapping = PRISMA_ERROR_MAPPING[code] || {
      status: 500,
      message: exception.message,
    };

    const status = mapping.status;
    const message = mapping.message;
    const data = exception.meta;
    const stack = exception.stack;

    const exceptionObj: ExceptionLogs = {
      status,
      code,
      message,
      data,
      stack,
    };

    this.logger.error(ctx.getRequest(), exceptionObj);

    const timestamp = new Date().toISOString();

    // Omit stack in production for security
    const isProduction = process.env.NODE_ENV === 'production';
    const payload = {
      status,
      code,
      detail: message,
      data,
      timestamp,
      ...(isProduction ? {} : { stack }),
    };

    response.status(status).json(payload);
  }
}
