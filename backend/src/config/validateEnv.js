// Fail fast on startup if any required environment variable is missing.
export const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'FRONTEND_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

export function validateEnv(env = process.env) {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !env[key] || String(env[key]).trim() === '',
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Copy backend/.env.example to backend/.env and fill in the values.',
    );
  }

  return true;
}

export default validateEnv;
