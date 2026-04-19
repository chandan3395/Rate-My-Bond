// ICR = EBITDA / Interest Expense
// Measures: can the company pay its interest from earnings?

// issuer_score = 
//   0.25 * ICR_score
// + 0.20 * leverage_score
// + 0.15 * cashflow_score
// + 0.15 * refinancing_score
// + 0.10 * sector_score
// + 0.10 * group_support_score
// + 0.05 * event_score

function getICRScore(ebitda, interestExpense) {
  if (!interestExpense || interestExpense === 0) return 58
  const icr = ebitda / interestExpense

  if (icr >= 5)             return 95
  if (icr >= 3)             return 80
  if (icr >= 2)             return 65
  if (icr >= 1.5)           return 50
  if (icr >= 1)             return 35
  return 15
}

// Leverage score = totalDebt / EBITDA
function getLeverageScore(totalDebt, ebitda) {
  if (!ebitda || ebitda === 0) return 58
  const leverage = totalDebt / ebitda

  if (leverage < 2)                         return 95
  if (leverage >= 2 && leverage < 3)        return 80
  if (leverage >= 3 && leverage < 4)        return 65
  if (leverage >= 4 && leverage < 6)        return 50
  if (leverage >= 6 && leverage < 8)        return 35
  return 20
}

function getCashflowScore(operatingCashFlow, ebitda) {
  if (!ebitda || ebitda === 0) return 58
  const cashFlow = operatingCashFlow / ebitda

  if (cashFlow >= 0.9)                          return 95
  if (cashFlow >= 0.75 && cashFlow < 0.9)       return 80
  if (cashFlow >= 0.6  && cashFlow < 0.75)      return 65
  if (cashFlow >= 0.4  && cashFlow < 0.6)       return 50
  if (cashFlow >= 0.2  && cashFlow < 0.4)       return 35
  return 15
}

// Refinancing score = debtDue12m / totalDebt
// Measures: how much debt is due soon? Higher = more risk
function getRefinancingScore(debtDue12m, totalDebt) {
  if (!totalDebt || totalDebt === 0) return 58
  const ratio = debtDue12m / totalDebt

  if (ratio < 0.10)                        return 95
  if (ratio >= 0.10 && ratio < 0.20)       return 80
  if (ratio >= 0.20 && ratio < 0.30)       return 65
  if (ratio >= 0.30 && ratio < 0.40)       return 50
  if (ratio >= 0.40 && ratio < 0.60)       return 35
  return 15
}

// Sector score — static lookup, no math
// Different pattern: object lookup instead of if-else chain
const SECTOR_SCORES = {
  'PSU / Utility':              90,
  'Infrastructure':             55,
  'Manufacturing / Logistics':  70,
  'NBFC':                       65,
  'Housing Finance':            60,
  'Real Estate':                45,
  'Financial Services':         61,
  'Not sure':                   58,
}

function getSectorScore(issuerType) {
  return SECTOR_SCORES[issuerType] ?? 58
}

// Group support score — same pattern
const GROUP_SUPPORT_SCORES = {
  'Government owned':   95,
  'AAA parent':         85,
  'Large group':        75,
  'Mid group':          60,
  'Standalone':         45,
  'Weak promoter':      30,
}

function getGroupSupportScore(groupSupport) {
  return GROUP_SUPPORT_SCORES[groupSupport] ?? 58
}

// Event score — starts at 100, penalties applied
// Measures: has anything bad happened recently?
function getEventScore(events = {}) {
  let score = 100

  if (events.minorDowngrade)       score -= 10
  if (events.majorDowngrade)       score -= 20
  if (events.onePaymentDelay)      score -= 20
  if (events.multipleDelays)       score -= 35
  if (events.defaultIn3Yrs)        score -= 50
  if (events.auditorQualification) score -= 10
  if (events.regulatoryAction)     score -= 15

  return Math.max(0, score)
}

export function getIssuerScore(data) {
  const icrScore         = getICRScore(data.ebitda, data.interestExpense)
  const leverageScore    = getLeverageScore(data.totalDebt, data.ebitda)
  const cashflowScore    = getCashflowScore(data.operatingCashFlow, data.ebitda)
  const refinancingScore = getRefinancingScore(data.debtDue12m, data.totalDebt)
  const sectorScore      = getSectorScore(data.issuerType)
  const groupScore       = getGroupSupportScore(data.groupSupport)
  const eventScore       = getEventScore(data.events)

  const issuerScore = (
    0.25 * icrScore +
    0.20 * leverageScore +
    0.15 * cashflowScore +
    0.15 * refinancingScore +
    0.10 * sectorScore +
    0.10 * groupScore +
    0.05 * eventScore
  )

  return Math.round(issuerScore)
}
