import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';

// Mock Firebase token verification. Two tokens map to two users; anything else
// is rejected. verifyToken -> config/firebase.js#verifyIdToken, so mocking this
// module exercises the real middleware without firebase-admin.
vi.mock('../src/config/firebase.js', () => ({
  initFirebase: () => ({}),
  verifyIdToken: vi.fn(async (token) => {
    const users = {
      'token-a': { uid: 'user-a', email: 'a@example.com' },
      'token-b': { uid: 'user-b', email: 'b@example.com' },
    };
    if (users[token]) return users[token];
    throw new Error('invalid token');
  }),
}));

import request from 'supertest';
import { createApp } from '../src/app.js';
import Issuer from '../src/models/Issuer.js';
import { startMemoryDb, stopMemoryDb, clearCollections } from './helpers/db.js';
import { baseInput } from './fixtures.js';

const app = createApp();

const bearer = (token) => ({ Authorization: `Bearer ${token}` });
const createAnalysis = (token, body = baseInput) =>
  request(app).post('/api/analyze').set(bearer(token)).send(body);

beforeAll(async () => {
  await startMemoryDb();
});

afterAll(async () => {
  await stopMemoryDb();
});

beforeEach(async () => {
  await clearCollections();
});

describe('auth', () => {
  it('rejects requests without a token (401)', async () => {
    const res = await request(app).get('/api/analyses');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects an invalid token (401)', async () => {
    const res = await request(app).get('/api/analyses').set(bearer('nope'));
    expect(res.status).toBe(401);
  });
});

describe('POST /api/analyze', () => {
  it('persists the analysis and returns the result + id', async () => {
    const res = await createAnalysis('token-a');

    expect(res.status).toBe(200);
    expect(res.body.finalScore).toBe(84);
    expect(res.body.ratingBand).toBe('AAA');
    expect(res.body.id).toBeDefined();

    // It should now be retrievable in the caller's history.
    const list = await request(app).get('/api/analyses').set(bearer('token-a'));
    expect(list.status).toBe(200);
    expect(list.body.items).toHaveLength(1);
    expect(list.body.items[0].finalScore).toBe(84);
  });

  it('returns 400 with per-field errors on invalid input', async () => {
    const res = await createAnalysis('token-a', { ...baseInput, amount: 5 });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('amount');
    expect(res.body.requestId).toBeDefined();
  });
});

describe('GET /api/analyses (ownership isolation)', () => {
  it('returns only the caller\'s records', async () => {
    await createAnalysis('token-a');
    await createAnalysis('token-a');
    await createAnalysis('token-b');

    const listA = await request(app).get('/api/analyses').set(bearer('token-a'));
    const listB = await request(app).get('/api/analyses').set(bearer('token-b'));

    expect(listA.body.items).toHaveLength(2);
    expect(listB.body.items).toHaveLength(1);
    expect(listA.body.items.every((i) => i.userId === 'user-a')).toBe(true);
  });

  it('paginates newest-first with a cursor', async () => {
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await createAnalysis('token-a');
    }

    const page1 = await request(app)
      .get('/api/analyses?limit=2')
      .set(bearer('token-a'));
    expect(page1.body.items).toHaveLength(2);
    expect(page1.body.nextCursor).toBeTruthy();

    const page2 = await request(app)
      .get(`/api/analyses?limit=2&cursor=${encodeURIComponent(page1.body.nextCursor)}`)
      .set(bearer('token-a'));
    expect(page2.body.items).toHaveLength(1);
  });
});

describe('GET/DELETE /api/analyses/:id (ownership checks)', () => {
  it('lets the owner read their analysis', async () => {
    const created = await createAnalysis('token-a');
    const res = await request(app)
      .get(`/api/analyses/${created.body.id}`)
      .set(bearer('token-a'));
    expect(res.status).toBe(200);
    expect(res.body.result.ratingBand).toBe('AAA');
  });

  it('forbids reading another user\'s analysis (403)', async () => {
    const created = await createAnalysis('token-a');
    const res = await request(app)
      .get(`/api/analyses/${created.body.id}`)
      .set(bearer('token-b'));
    expect(res.status).toBe(403);
  });

  it('returns 404 for a missing analysis', async () => {
    const res = await request(app)
      .get('/api/analyses/64b7f0c2f1a2b3c4d5e6f7a8')
      .set(bearer('token-a'));
    expect(res.status).toBe(404);
  });

  it('forbids deleting another user\'s analysis (403)', async () => {
    const created = await createAnalysis('token-a');
    const res = await request(app)
      .delete(`/api/analyses/${created.body.id}`)
      .set(bearer('token-b'));
    expect(res.status).toBe(403);
  });

  it('deletes the owner\'s analysis', async () => {
    const created = await createAnalysis('token-a');

    const del = await request(app)
      .delete(`/api/analyses/${created.body.id}`)
      .set(bearer('token-a'));
    expect(del.status).toBe(200);

    const after = await request(app)
      .get(`/api/analyses/${created.body.id}`)
      .set(bearer('token-a'));
    expect(after.status).toBe(404);
  });
});

describe('GET /api/issuers', () => {
  it('returns issuers seeded into MongoDB, sorted by name', async () => {
    await Issuer.create([
      { isin: 'IN0001', issuer: 'Beta Industries', issuerType: 'NBFC', creditRating: 'AA' },
      { isin: 'IN0002', issuer: 'Alpha Power', issuerType: 'PSU / Utility', creditRating: 'AAA' },
    ]);

    const res = await request(app).get('/api/issuers').set(bearer('token-a'));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].issuer).toBe('Alpha Power');
    expect(res.body[1].issuer).toBe('Beta Industries');
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/api/issuers');
    expect(res.status).toBe(401);
  });
});
