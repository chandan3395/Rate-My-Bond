import mongoose from 'mongoose';
import Analysis from '../models/Analysis.js';
import { analyzeBond } from './finalScorer.js';
import { ApiError } from '../utils/ApiError.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Run the existing scoring engine, persist the result, and return the doc.
export async function createAnalysis(userId, input) {
  const result = analyzeBond(input);

  const doc = await Analysis.create({
    userId,
    input,
    result,
    ratingBand: result.ratingBand,
    finalScore: result.finalScore,
  });

  return doc;
}

// Cursor pagination, newest-first. `cursor` is the ISO createdAt of the last
// item from the previous page; we return items strictly older than it.
export async function listAnalyses(userId, { limit, cursor } = {}) {
  const safeLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const query = { userId };

  if (cursor) {
    const cursorDate = new Date(cursor);
    if (!Number.isNaN(cursorDate.getTime())) {
      query.createdAt = { $lt: cursorDate };
    }
  }

  // Fetch one extra to know whether there's a next page.
  const docs = await Analysis.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(safeLimit + 1)
    .lean();

  let nextCursor = null;
  if (docs.length > safeLimit) {
    docs.pop();
    const last = docs[docs.length - 1];
    nextCursor = new Date(last.createdAt).toISOString();
  }

  return { items: docs, nextCursor };
}

// Ownership-checked read: 404 if missing, 403 if owned by another user.
export async function getAnalysis(userId, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, 'Analysis not found');
  }

  const doc = await Analysis.findById(id).lean();
  if (!doc) {
    throw new ApiError(404, 'Analysis not found');
  }
  if (doc.userId !== userId) {
    throw new ApiError(403, 'You do not have access to this analysis');
  }

  return doc;
}

// Ownership-checked delete: 404 if missing, 403 if owned by another user.
export async function deleteAnalysis(userId, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, 'Analysis not found');
  }

  const doc = await Analysis.findById(id);
  if (!doc) {
    throw new ApiError(404, 'Analysis not found');
  }
  if (doc.userId !== userId) {
    throw new ApiError(403, 'You do not have access to this analysis');
  }

  await doc.deleteOne();
  return { id };
}

export default {
  createAnalysis,
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
};
