/* eslint-disable @typescript-eslint/no-explicit-any */
import { Roarr, ROARR, Message, getLogLevelName } from 'roarr';

export interface ICustormLogger {
  trace(...args: any): void;
  debug(...args: any): void;
  info(...args: any): void;
  warn(...args: any): void;
  error(...args: any): void;
  fatal(...args: any): void;
}
export class LoggerAdapter {
  private thresholdLevel: number;
  private logger: ICustormLogger;
  constructor(customLogger?: ICustormLogger) {
    this.thresholdLevel = process.env.REACT_APP_LOGLEVEL
      ? Number(process.env.REACT_APP_LOGLEVEL)
      : 0;

    this.logger = customLogger ? customLogger : Roarr;

    ROARR.write = (messageStr) => {
      const messageJson = JSON.parse(messageStr) as Message;
      const logLevel = Number(messageJson.context.logLevel);
      if (!isNaN(logLevel) && logLevel >= this.thresholdLevel) {
        console.log(`[${getLogLevelName(logLevel)}] ${messageJson.message}`);
      }
    };
  }
  trace(...args: any) {
    this.logger.trace(...args);
  }
  debug(...args: any) {
    this.logger.debug(...args);
  }
  info(...args: any) {
    this.logger.info(...args);
  }
  warn(...args: any) {
    this.logger.warn(...args);
  }
  error(...args: any) {
    this.logger.error(...args);
  }
  fatal(...args: any) {
    this.logger.fatal(...args);
  }
}
