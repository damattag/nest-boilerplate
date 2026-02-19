import 'dotenv/config';
import * as fs from 'node:fs';
import { addColors, createLogger, format, transports } from 'winston';
import { envSchema } from '@/shared/services/env';

const env = envSchema.parse(process.env);

const isProduction = env.NODE_ENV === 'production';
const logsPath = `${process.cwd()}/logs`;

if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

const formatters = [format.timestamp(), format.json()];

const requestTransporters: Array<
  transports.FileTransportInstance | transports.ConsoleTransportInstance
> = [
  new transports.File({
    filename: `${logsPath}/error.log`,
    level: 'error',
    handleExceptions: true,
    handleRejections: true,
  }),
  new transports.Console({
    format: format.combine(
      ...formatters,
      format.colorize({ all: true }),
      format.printf((info) => {
        const { message } = info;

        return `${message}`;
      }),
    ),
    handleExceptions: true,
    handleRejections: true,
  }),
];

const devTransporters: Array<
  transports.FileTransportInstance | transports.ConsoleTransportInstance
> = [
  new transports.File({
    filename: `${logsPath}/warn.log`,
    level: 'warn',
  }),
  new transports.File({
    filename: `${logsPath}/debug.log`,
    level: 'debug',
  }),
  new transports.File({
    filename: `${logsPath}/info.log`,
    level: 'info',
  }),
];

if (!isProduction) {
  requestTransporters.push(...devTransporters);
  formatters.push(format.prettyPrint());
  addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    verbose: 'cyan',
  });
}

export const logger = createLogger({
  format: format.combine(...formatters),
  transports: requestTransporters,
  level: isProduction ? 'error' : 'debug',
});
