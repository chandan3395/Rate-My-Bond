# Rate My Bond

A full-stack bond analysis web app that scores and rates bonds based on issuer financials, instrument structure, liquidity, return, and investor fit.

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router v6** (lazy-loaded routes)
- **Firebase Auth** (Google OAuth)

### Backend
- **Node.js** + **Express 5** (ESM)
- **express-rate-limit**

---

## Features

- Google Sign-In via Firebase (protected routes redirect unauthenticated users to `/signin`)
- Bond scoring engine with a weighted multi-factor model
- Score breakdown across 5 dimensions: Issuer, Structure, Liquidity, Return, Fit
- Final rating band output: `AAA → B/Junk`
- Expected loss and risk-adjusted return calculation
- Rate limiting on the analysis API (30 req / 15 min)
- Lazy-loaded pages for performance

---

## Scoring Model

The final score is computed as:

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
├── backend/
│   ├── server.js
│   └── src/
│       ├── middleware/
│       │   └── validation.js
│       ├── routes/
│       │   └── analyze.js          # POST /api/analyze
│       ├── services/
│       │   ├── scoringEngine.js    # Issuer score calculation
│       │   ├── finalScorer.js      # Final score + rating band
│       │   ├── fitScorer.js        # Investor fit score
│       │   ├── expectedLoss.js     # PD × LGD calculation
│       │   ├── pdCalculator.js
│       │   └── lgdCalculator.js
│       └── modelConfig.js          # Score lookup tables & weights
│
└── frontend/
    └── src/
        ├── components/
        │   ├── analysis/           # Score breakdown UI
        │   ├── form/               # Bond input form
        │   ├── layout/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── ...
        ├── context/
        │   └── AuthContext.jsx     # Firebase auth state via Context API
        ├── lib/
        │   └── firebase.js         # Firebase init + GoogleAuthProvider
        ├── pages/
        │   ├── BondCalculatorPage.jsx
        │   ├── LandingPage.jsx
        │   ├── SignInPage.jsx
        │   └── StaticPage.jsx
        ├── hooks/
        │   └── useBondForm.js
        ├── data/
        │   └── bondFormConfig.js
        └── App.jsx
```

---

## API

### `POST /api/analyze`

Accepts bond input data and returns a full score breakdown.

**Response:**
```json
{
  "issuerScore": 74,
  "structureScore": 68,
  "liquidityScore": 55,
  "returnScore": 75,
  "fitScore": 70,
  "finalScore": 70,
  "ratingBand": "AA",
  "expectedLoss": 0.021,
  "riskAdjustedReturn": 0.049
}
```

---

## Environment Variables

### Backend — `backend/.env`
```env
PORT=
FRONTEND_URL=
```

### Frontend — `frontend/.env`
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.
