import { Roarr, ROARR, Message, getLogLevelName } from 'roarr';
export class LoggerAdapter {
  static init() {
    const level = process.env.REACT_APP_LOGLEVEL
      ? Number(process.env.REACT_APP_LOGLEVEL)
      : 0;
    const logger = Roarr;

    ROARR.write = (messageStr) => {
      const messageJson = JSON.parse(messageStr) as Message;
      const logLevel = Number(messageJson.context.logLevel);
      if (!isNaN(logLevel) && logLevel >= level) {
        console.log(`[${getLogLevelName(logLevel)}] ${messageJson.message}`);
      }
    };
    return logger;
  }
}
