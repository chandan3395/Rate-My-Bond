import { logger } from '../utils/logger.js';

// Central 4-arg Express error handler. Registered last. Returns a consistent
// shape: { success: false, message, requestId }, plus `fields` when the error
// carries per-field validation details.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  const payload = {
    success: false,
    message: err.message || 'Internal server error',
    requestId: req.id,
  };

  if (err.details && err.details.fields) {
    payload.fields = err.details.fields;
  }

  const log = req.log || logger;
  if (statusCode >= 500) {
    log.error({ err, requestId: req.id }, 'Request failed');
  } else {
    log.warn({ requestId: req.id, statusCode, msg: err.message }, 'Request error');
  }

  res.status(statusCode).json(payload);
}

export default errorHandler;
