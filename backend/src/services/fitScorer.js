//  This measures how well the bond fits the user's profile. Nothing to do with bond quality, purely about the user's situation.

// fit_score = 0.35 * horizon_match
//           + 0.25 * risk_match
//           + 0.20 * income_match
//           + 0.20 * liquidity_match

const HORIZON_MATRIX = {
    '< 3 years' : { '< 1 year': 82, 
                    '1 - 3 years': 90, 
                    '3 - 5 years': 68,
                    '5+ years': 55
                },

    '3 - 5 years' : { '< 1 year': 54, 
                    '1 - 3 years': 70, 
                    '3 - 5 years': 92,
                    '5+ years': 78
                },

    '5 - 10 years' : { '< 1 year': 30, 
                    '1 - 3 years': 38, 
                    '3 - 5 years': 64,
                    '5+ years': 90
                },
            
    '> 10 years' : { '< 1 year': 10, 
                    '1 - 3 years': 18, 
                    '3 - 5 years': 30,
                    '5+ years': 68
                },
}



export function getFitScore(data, bondQualityScore) {
  const horizon_match = HORIZON_MATRIX[data.tenure]?.[data.horizon] ?? 58

  let risk_match = 0
  if (data.riskProfile === 'Conservative') {
    if (bondQualityScore >= 80)       risk_match = 92
    else if (bondQualityScore >= 65)  risk_match = 58
    else                              risk_match = 26
  } else if (data.riskProfile === 'Balanced') {
    if (bondQualityScore >= 70)       risk_match = 86
    else if (bondQualityScore >= 55)  risk_match = 72
    else                              risk_match = 42
  } else {
    risk_match = bondQualityScore >= 45 ? 84 : 58
  }

  let income_match = 0
  if (data.returnPreference === 'Regular Income') {
    income_match = ['Monthly', 'Quarterly', 'Annual'].includes(data.payoutType) ? 90 : 42
  } else if (data.returnPreference === 'Maturity Focused') {
    income_match = data.payoutType === 'Cumulative' ? 92 : 58
  } else {
    income_match = (data.payoutType === 'Quarterly' || data.payoutType === 'Cumulative') ? 82 : 70
  }

  let liquidity_match = 0
  if (data.liquidity === 'Easy to exit')       liquidity_match = 90
  else if (data.liquidity === 'Moderate')      liquidity_match = 70
  else if (data.liquidity === 'Hard to exit')  liquidity_match = 40
  else                                         liquidity_match = 55

  const fitScore = (
    0.35 * horizon_match +
    0.25 * risk_match +
    0.20 * income_match +
    0.20 * liquidity_match
  )

  return Math.round(fitScore)
}