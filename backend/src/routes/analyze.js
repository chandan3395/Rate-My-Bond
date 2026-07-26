import express from 'express'
import { validateBondInput } from '../middleware/validation.js'
import { createAnalysis } from '../services/analysis.service.js'

const router = express.Router()

// verifyToken is applied at mount time (see app.js).
// Flow: validateBondInput -> createAnalysis (runs analyzeBond + persists).
router.post('/', validateBondInput, async (req, res, next) => {
  try {
    const doc = await createAnalysis(req.user.uid, req.body)

    // Return the full score breakdown plus the saved record's id.
    res.json({ ...doc.result, id: doc._id, createdAt: doc.createdAt })
  } catch (err) {
    next(err)
  }
})

export default router
