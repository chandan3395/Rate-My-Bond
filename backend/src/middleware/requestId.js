import { randomUUID } from 'node:crypto';

// Attach a stable request id to each request (honoring an inbound
// X-Request-Id if present), echo it back on the response, and expose it as
// req.id for the request logger and error handler.
export function requestId(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const id = typeof incoming === 'string' && incoming ? incoming : randomUUID();

  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

export default requestId;
