import express from 'express';
import {
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
} from '../services/analysis.service.js';

const router = express.Router();

// All routes are mounted behind verifyToken (see app.js), so req.user is set.
// Ownership checks live in the service layer.

// GET /api/analyses?limit=10&cursor=<ISO createdAt> -> { items, nextCursor }
router.get('/', async (req, res, next) => {
  try {
    const { limit, cursor } = req.query;
    const data = await listAnalyses(req.user.uid, { limit, cursor });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/analyses/:id -> own analysis (404 missing, 403 not owner)
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await getAnalysis(req.user.uid, req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/analyses/:id -> delete own analysis (404 missing, 403 not owner)
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteAnalysis(req.user.uid, req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
