/* eslint-disable no-console */
import chalk from 'chalk';

type SeverityType = 'info' | 'success' | 'warn' | 'error';
type SeverityRecord = Record<SeverityType, chalk.Chalk>;

export const colors = {
  gray: chalk.gray,
  cyan: chalk.cyan,
  green: chalk.green,
  yellow: chalk.yellow,
  red: chalk.red,
};

const severity: SeverityRecord = {
  info: colors.cyan,
  success: colors.green,
  warn: colors.yellow,
  error: colors.red,
};

function createLoggerFn(level: SeverityType) {
  return function (message: string) {
    console.log(severity[level](message));
  };
}

export const logger = {
  severity,

  log(message: string) {
    console.log(message);
  },
  info: createLoggerFn('info'),
  success: createLoggerFn('success'),
  warn: createLoggerFn('warn'),
  error: createLoggerFn('error'),
};
