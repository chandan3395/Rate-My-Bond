import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { logger } from './utils/logger.js';
import { ApiError } from './utils/ApiError.js';
import { requestId } from './middleware/requestId.js';
import { sanitize } from './middleware/sanitize.js';
import { verifyToken } from './middleware/verifyToken.js';
import { errorHandler } from './middleware/errorHandler.js';

import analyzeRouter from './routes/analyze.js';
import issuersRouter from './routes/issuers.js';
import analysesRouter from './routes/analyses.js';

// Build a locked-down CORS allow-list from FRONTEND_URL (comma-separated).
function buildCorsOptions() {
  const allowList = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      // Allow non-browser clients / same-origin requests (no Origin header).
      if (!origin) {
        return callback(null, true);
      }
      if (allowList.includes(origin)) {
        return callback(null, true);
      }
      // Disallowed origin: omit CORS headers so the browser blocks it.
      return callback(null, false);
    },
    credentials: true,
  };
}

// App factory: configured Express app (middleware + routes). No listen, no db
// connect — so tests can import and exercise it directly.
export function createApp() {
  const app = express();

  const analyzeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many requests' },
  });

  // Middleware order: helmet -> cors -> json -> mongo-sanitize -> requestId
  //                   -> logger -> rate-limit -> routes -> error handler.
  app.use(helmet());
  app.use(cors(buildCorsOptions()));
  app.use(express.json());
  app.use(sanitize);
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.id,
    }),
  );

  app.get('/', (req, res) => {
    res.json({ message: 'rate my bond API is running' });
  });

  // Protected API routes. Rate limiting stays on /api/analyze.
  app.use('/api/analyze', analyzeLimiter, verifyToken, analyzeRouter);
  app.use('/api/issuers', verifyToken, issuersRouter);
  app.use('/api/analyses', verifyToken, analysesRouter);

  // Unknown route -> 404 via central handler.
  app.use((req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
  });

  app.use(errorHandler);

  return app;
}

export default createApp;
