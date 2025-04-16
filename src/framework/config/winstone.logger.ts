import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

import { isProd } from '../../common/constant';

const commonLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('pockey-api', {
    colors: !isProd,
    prettyPrint: true,
  }),
);

const winstonConfig = {
  level: isProd ? 'info' : 'debug',
  format: commonLogFormat,
  transports: [new winston.transports.Console({ format: commonLogFormat })],
  exceptionHandlers: [new winston.transports.Console({ format: commonLogFormat })],
  rejectionHandlers: [new winston.transports.Console({ format: commonLogFormat })],
};

export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(winstonConfig);
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
