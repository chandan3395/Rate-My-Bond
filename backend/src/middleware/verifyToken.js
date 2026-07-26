import { verifyIdToken } from '../config/firebase.js';
import { ApiError } from '../utils/ApiError.js';

// Reads `Authorization: Bearer <idToken>`, verifies it via Firebase Admin, and
// attaches req.user = { uid, email }. Returns 401 on missing/invalid tokens.
//
// Verification is delegated to config/firebase.js#verifyIdToken so it can be
// mocked in tests.
export async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(401, 'Missing or invalid Authorization header');
    }

    const decoded = await verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    return next();
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

export default verifyToken;
