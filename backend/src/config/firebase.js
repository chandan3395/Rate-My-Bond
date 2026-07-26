import admin from 'firebase-admin';

// Guarded/lazy Firebase Admin initialization.
//
// Importing this module never touches Firebase, so importing the Express app in
// tests (where service-account creds are absent) does NOT crash. Initialization
// happens on first use via initFirebase(); token verification goes through
// verifyIdToken(), which is the single point tests mock.
let initialized = false;

export function initFirebase() {
  if (initialized) {
    return admin;
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    // Not configured (e.g. test/import-time). Stay uninitialized rather than
    // throwing so the app can be imported without credentials.
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // The private key is stored with escaped newlines in .env; restore them.
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  initialized = true;
  return admin;
}

// Verify a Firebase ID token and return the decoded claims. Isolated here so
// tests can mock this module's verifyIdToken without touching firebase-admin.
export async function verifyIdToken(idToken) {
  const app = initFirebase();

  if (!app) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, ' +
        'FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.',
    );
  }

  return app.auth().verifyIdToken(idToken);
}

export default { initFirebase, verifyIdToken };
