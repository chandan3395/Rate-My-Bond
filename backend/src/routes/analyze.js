import express from 'express'
import { analyzeBond } from '../services/finalScorer.js'
import { validateBondInput } from '../middleware/validation.js'

const router = express.Router()

router.post('/',validateBondInput, (req, res) => {
  const data = req.body
  const result = analyzeBond(data)
  res.json(result)
})

export default router