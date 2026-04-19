// expectedLoss = PD × LGD

// liquidityPenalty:
//   Easy to exit  → 0
//   Moderate      → 0.005
//   Hard to exit  → 0.02
//   Not sure      → 0.01

riskAdjustedReturn = (interestRate / 100) - expectedLoss - liquidityPenalty

import { getPD } from './pdCalculator.js'
import { getLGD } from './lgdCalculator.js'

export function getExpectedLoss(data) {
  const PD = getPD(data)
  const LGD = getLGD(data)
  const expectedLoss = PD * LGD

  let liquidityPenalty = 0
  if (data.liquidity === 'Easy to exit')  liquidityPenalty = 0
  if (data.liquidity === 'Moderate')      liquidityPenalty = 0.005
  if (data.liquidity === 'Hard to exit')  liquidityPenalty = 0.02
  if (data.liquidity === 'Not sure')      liquidityPenalty = 0.01

  const riskAdjustedReturn = (data.interestRate / 100) - expectedLoss - liquidityPenalty

  return { expectedLoss, liquidityPenalty, riskAdjustedReturn }
}