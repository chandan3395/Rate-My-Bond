import express from 'express'
import Issuer from '../models/Issuer.js'
import { ApiError } from '../utils/ApiError.js'

const router = express.Router()

// Issuer catalog served FROM MongoDB. Mounted behind verifyToken (see app.js).
router.get('/', async (req, res, next) => {
  try {
    const issuers = await Issuer.find({}, {
      issuer: 1,
      issuerType: 1,
      creditRating: 1,
      instrumentType: 1,
      securityType: 1,
      couponRate: 1,
      maturityDate: 1,
      yieldToMaturity: 1,
      _id: 0
    }).sort({ issuer: 1 })

    res.json(issuers)
  } catch (err) {
    next(new ApiError(500, 'Failed to fetch issuers'))
  }
})

export default router
