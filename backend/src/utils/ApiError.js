// Typed application error carrying an HTTP status code and optional structured
// details (e.g. per-field validation errors). Thrown/forwarded via next(err)
// and rendered by the central error handler into a consistent JSON shape.
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export default ApiError;
