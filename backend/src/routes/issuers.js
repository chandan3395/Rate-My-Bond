import express from 'express'
import Issuer from '../models/Issuer.js'

const router = express.Router()

router.get('/', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch issuers' })
  }
})

export default router