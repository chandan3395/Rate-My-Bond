# Rate My Bond

A full-stack bond analysis web app that scores and rates bonds based on issuer
financials, instrument structure, liquidity, return, and investor fit. Signed-in
users get a Firebase-authenticated API, per-user saved analyses, and a history
view.

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router v6** (lazy-loaded routes)
- **Firebase Auth** (Google OAuth)
- Single authenticated API client (`src/lib/api.js`)

### Backend
- **Node.js** + **Express 5** (ESM)
- **MongoDB** + **Mongoose** (issuer catalog + saved analyses)
- **firebase-admin** (server-side ID-token verification)
- **helmet**, **express-mongo-sanitize**, **express-rate-limit** (hardening)
- **pino** + **pino-http** (structured logging) with per-request IDs
- **Vitest** + **supertest** + **mongodb-memory-server** (tests)

---

## Auth model

1. The frontend signs in with Firebase (Google) and obtains an ID token.
2. The API client attaches `Authorization: Bearer <idToken>` to **every** backend
   request when a user is signed in.
3. The backend verifies the token with firebase-admin
   (`middleware/verifyToken.js`) and sets `req.user = { uid, email }`.
4. All `/api/*` routes are protected. Saved analyses are owned by `req.user.uid`;
   ownership is enforced in the service layer (404 if missing, 403 if owned by
   another user).

---

## API

All endpoints below require a valid `Authorization: Bearer <Firebase ID token>`
header. Errors use a consistent shape:
`{ "success": false, "message": "...", "requestId": "...", "fields"?: {...} }`.

### `POST /api/analyze`
Validates the bond input, runs the scoring engine, **persists** the analysis for
the signed-in user, and returns the full breakdown plus the saved record id.

```json
{
  "issuerScore": 88,
  "structureScore": 83,
  "liquidityScore": 66,
  "returnScore": 90,
  "fitScore": 86,
  "finalScore": 84,
  "ratingBand": "AAA",
  "expectedLoss": 0.003,
  "riskAdjustedReturn": 0.076,
  "id": "665f...",
  "createdAt": "2026-07-26T12:00:00.000Z"
}
```

### `GET /api/issuers`
Returns the issuer catalog **from MongoDB** (used by the issuer autocomplete on
the bond form).

### `GET /api/analyses?limit=10&cursor=<ISO createdAt>`
Cursor-paginated list of the caller's saved analyses, newest first.

```json
{ "items": [ { "_id": "...", "input": {...}, "result": {...}, "ratingBand": "AAA", "finalScore": 84, "createdAt": "..." } ], "nextCursor": "2026-07-26T11:59:00.000Z" }
```

### `GET /api/analyses/:id`
Returns one of the caller's analyses (`403` if owned by someone else, `404` if
missing).

### `DELETE /api/analyses/:id`
Deletes one of the caller's analyses (same ownership checks).

---

## Scoring Model

The scoring math is unchanged and computed **only** on the backend. The final
score is:

```
finalScore = 0.35 × issuerScore
           + 0.20 × structureScore
           + 0.15 × liquidityScore
           + 0.15 × returnScore
           + 0.15 × fitScore
```

### Issuer Score sub-factors

| Factor             | Weight |
|--------------------|--------|
| ICR (EBITDA / Interest) | 25% |
| Leverage (Debt / EBITDA) | 20% |
| Cash Flow Conversion | 15% |
| Refinancing Risk | 15% |
| Sector             | 10% |
| Group Support      | 10% |
| Credit Events      | 5%  |

### Rating Bands

| Score | Rating  |
|-------|---------|
| ≥ 80  | AAA     |
| ≥ 70  | AA      |
| ≥ 60  | A       |
| ≥ 50  | BBB     |
| ≥ 45  | BB      |
| < 45  | B/Junk  |

---

## Project Structure

```
Rate-My-Bond/
├── .github/workflows/ci.yml       # CI: backend test + frontend build (Node 20)
├── backend/
│   ├── server.js                  # bootstrap: env -> validate -> Mongo -> listen
│   └── src/
│       ├── app.js                 # Express app factory (no listen/connect)
│       ├── config/
│       │   ├── db.js              # connect/disconnect helpers
│       │   ├── firebase.js       # guarded firebase-admin init + verifyIdToken
│       │   └── validateEnv.js    # fail-fast env validation
│       ├── middleware/
│       │   ├── verifyToken.js    # Firebase ID-token auth
│       │   ├── requestId.js
│       │   ├── sanitize.js       # express-mongo-sanitize (Express 5 safe)
│       │   ├── validation.js
│       │   └── errorHandler.js   # central error responses
│       ├── models/
│       │   ├── Issuer.js
│       │   └── Analysis.js       # saved analyses (userId-scoped)
│       ├── routes/
│       │   ├── analyze.js        # POST /api/analyze
│       │   ├── analyses.js       # GET/GET:id/DELETE /api/analyses
│       │   └── issuers.js        # GET /api/issuers (from MongoDB)
│       ├── services/
│       │   ├── analysis.service.js  # create/list/get/delete (ownership)
│       │   ├── scoringEngine.js  # issuer score
│       │   ├── finalScorer.js    # analyzeBond: final score + rating band
│       │   ├── fitScorer.js
│       │   ├── expectedLoss.js
│       │   ├── pdCalculator.js
│       │   └── lgdCalculator.js
│       ├── scripts/              # seedIssuers.js, enrichIssuers.js, listIssuers.js
│       ├── data/listed_bonds.csv
│       ├── utils/                # ApiError.js, logger.js
│       └── modelConfig.js        # score lookup tables & weights
│   └── tests/                    # vitest: scoring.test.js, api.test.js
│
└── frontend/
    └── src/
        ├── lib/
        │   ├── api.js            # authenticated fetch client
        │   └── firebase.js
        ├── hooks/
        │   ├── useBondForm.js
        │   └── useIssuers.js     # loads issuers from GET /api/issuers
        ├── pages/
        │   ├── BondCalculatorPage.jsx
        │   ├── HistoryPage.jsx        # protected: saved analyses list
        │   ├── AnalysisDetailPage.jsx # protected: single analysis + delete
        │   └── ...
        └── ...
```

---

## Setup

### Prerequisites
- Node.js 20+
- A MongoDB instance (local or Atlas)
- A Firebase project with Google sign-in enabled

### 1. Backend
```bash
cd backend
cp .env.example .env      # fill in the values (see below)
npm install
npm run seed              # one-time: load issuers into MongoDB from listed_bonds.csv
npm run dev               # or: npm start
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env      # fill in the values (see below)
npm install
npm run dev
```

### Seeding the issuer catalog
The issuer autocomplete is served from MongoDB. Populate it from the bundled CSV:
```bash
cd backend
npm run seed              # runs src/scripts/seedIssuers.js
```
`npm run seed` requires `MONGO_URI` to be set in `backend/.env`. To list what was
seeded: `node src/scripts/listIssuers.js`.

---

## Environment Variables

### Backend — `backend/.env` (see `backend/.env.example`)
| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `FRONTEND_URL` | ✅ | Comma-separated CORS allow-list (no wildcard) |
| `FIREBASE_PROJECT_ID` | ✅ | From the service-account key |
| `FIREBASE_CLIENT_EMAIL` | ✅ | From the service-account key |
| `FIREBASE_PRIVATE_KEY` | ✅ | From the service-account key (keep `\n` escapes) |
| `PORT` | ⬜ | Defaults to `3000` |
| `LOG_LEVEL` | ⬜ | pino level; defaults to `info` |

> `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` come from a **service-account
> key** you generate in the Firebase console → Project settings → Service accounts
> → **Generate new private key**.

### Frontend — `frontend/.env` (see `frontend/.env.example`)
| Variable | Notes |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:3000` |
| `VITE_FIREBASE_API_KEY` | Firebase Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Web app config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Web app config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Web app config |
| `VITE_FIREBASE_APP_ID` | Firebase Web app config |

---

## Testing

Backend tests use Vitest with an in-memory MongoDB and mocked Firebase token
verification.

```bash
cd backend
npm test          # run once
npm run test:watch
```

Coverage includes: the pure scoring functions (known inputs → expected outputs),
and integration tests over the Express app (auth required, analyses persist and
are user-isolated, ownership 403/404, delete, and issuers served from Mongo).

Frontend build check:
```bash
cd frontend
npm run build
```

## CI

`.github/workflows/ci.yml` runs on push and PR (Node 20): backend `npm ci` +
`npm test`, and frontend `npm ci` + `npm run build`.
