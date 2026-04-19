// This calculates Probability of Default. How likely is the company to actually fail to repay.

// Base PD by rating 
const BASE_PD = {
  'AAA':          0.005,
  'AA+':          0.008,
  'AA':           0.010,
  'AA-':          0.013,
  'A+':           0.018,
  'A':            0.023,
  'A-':           0.030,
  'BBB+':         0.042,
  'BBB':          0.055,
  'BBB-':         0.070,
  'BB and below': 0.150,
  'Not sure':     0.050,
}

export function getPD(data){
    let basePD = BASE_PD[data.creditRating] ?? 0.05 
    if(data.issuerType === 'NBFC' || data.issuerType === 'Real Estate') 
        basePD += 0.020
    if(data.totalDebt / data.ebitda > 6)
        basePD += 0.015
    if(data.debtDue12m / data.totalDebt > 0.4)
        basePD += 0.020
    if(data.groupSupport === 'Government owned' || data.groupSupport === 'AAA parent')
        basePD -= 0.008

    return Math.max(0.001, Math.min(0.99, basePD))
}