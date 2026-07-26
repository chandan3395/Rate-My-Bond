import mongoSanitize from 'express-mongo-sanitize';

// express-mongo-sanitize's default middleware reassigns req.query, which throws
// under Express 5 (req.query is a getter with no setter). Instead we call its
// sanitize() helper, which strips `$`/`.` keys IN PLACE, on each payload — the
// supported Express 5 workaround.
export function sanitize(req, res, next) {
  for (const key of ['body', 'params', 'query']) {
    if (req[key]) {
      mongoSanitize.sanitize(req[key], { replaceWith: '_' });
    }
  }
  next();
}

export default sanitize;
