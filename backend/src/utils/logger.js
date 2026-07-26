import pino from 'pino';

// Structured logger. Silenced during tests to keep output clean; level is
// otherwise configurable via LOG_LEVEL.
const level =
  process.env.NODE_ENV === 'test'
    ? 'silent'
    : process.env.LOG_LEVEL || 'info';

export const logger = pino({ level });

export default logger;
