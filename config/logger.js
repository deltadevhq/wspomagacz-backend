const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');
const { getTimestamp } = require('../utilities/dateUtils');
const {
  logs_enabled,
  logs_level,
  logs_file_path,
  logs_max_size,
  logs_max_files,
  logs_compression,
} = require('./settings')

// Custom log format including the timestamp and uppercase log level
const customFormat = format.printf(({ timestamp, level, message }) => {
  return `[${level.toUpperCase()}][${timestamp}] ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  level: logs_level,
  format: format.combine(
    format.timestamp({ format: getTimestamp }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    ...(logs_enabled ? [
      new DailyRotateFile({
        filename: logs_file_path,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: logs_compression,
        maxSize: logs_max_size,
        maxFiles: logs_max_files,
      })
    ] : []),
  ],
});

// Override console methods
const overrideConsoleMethod = (method, logLevel) => {
  console[method] = function (...args) {
    const message = args.join(' ');
    logger[logLevel](message);
  };
};

// Override console methods
overrideConsoleMethod('debug', 'debug');
overrideConsoleMethod('log', 'info');
overrideConsoleMethod('warn', 'warn');
overrideConsoleMethod('error', 'error');

module.exports = logger;