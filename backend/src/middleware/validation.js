import { ApiError } from '../utils/ApiError.js';

export function validateBondInput(req, res, next) {
  const data = req.body
  const errors = {}

  // required string fields
  const requiredStrings = [
    'horizon', 'riskProfile', 'returnPreference', 'issuer',
    'issuerType', 'creditRating', 'instrumentType', 'securityType',
    'tenure', 'payoutType', 'liquidity'
  ]

  requiredStrings.forEach(field => {
    if (!data[field] || typeof data[field] !== 'string') {
      errors[field] = `${field} is required`
    }
  })

  // amount
  if (!data.amount || typeof data.amount !== 'number' || data.amount < 10000 || data.amount > 1000000) {
    errors.amount = 'Amount must be a number between 10000 and 1000000'
  }

  // interestRate
  if (!data.interestRate || typeof data.interestRate !== 'number' || data.interestRate < 4 || data.interestRate > 18) {
    errors.interestRate = 'Interest rate must be a number between 4 and 18'
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed', { fields: errors }))
  }

  next()
}
