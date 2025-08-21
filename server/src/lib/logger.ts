import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const pinoConfig = {
  level: isProduction ? 'info' : 'debug',
  formatters: {
    level: (label: string) => ({ level: label }),
  },
};

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
  },
});

const logger = pino(pinoConfig, isProduction ? undefined : transport);

export default logger;