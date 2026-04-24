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

import {
  GROUP_SUPPORT_SCORES,
  ISSUER_WEIGHTS,
  SECTOR_SCORES,
} from "../modelConfig.js";

function getICRScore(ebitda, interestExpense) {
  if (!interestExpense || interestExpense === 0) return 58;
  const icr = ebitda / interestExpense;

  if (icr >= 5) return 95;
  if (icr >= 3) return 80;
  if (icr >= 2) return 65;
  if (icr >= 1.5) return 50;
  if (icr >= 1) return 35;
  return 15;
}

function getLeverageScore(totalDebt, ebitda) {
  if (!ebitda || ebitda === 0) return 58;
  const leverage = totalDebt / ebitda;

  if (leverage < 2) return 95;
  if (leverage >= 2 && leverage < 3) return 80;
  if (leverage >= 3 && leverage < 4) return 65;
  if (leverage >= 4 && leverage < 6) return 50;
  if (leverage >= 6 && leverage < 8) return 35;
  return 20;
}

function getCashflowScore(operatingCashFlow, ebitda) {
  if (!ebitda || ebitda === 0) return 58;
  const cashFlow = operatingCashFlow / ebitda;

  if (cashFlow >= 0.9) return 95;
  if (cashFlow >= 0.75 && cashFlow < 0.9) return 80;
  if (cashFlow >= 0.6 && cashFlow < 0.75) return 65;
  if (cashFlow >= 0.4 && cashFlow < 0.6) return 50;
  if (cashFlow >= 0.2 && cashFlow < 0.4) return 35;
  return 15;
}

function getRefinancingScore(debtDue12m, totalDebt) {
  if (!totalDebt || totalDebt === 0) return 58;
  const ratio = debtDue12m / totalDebt;

  if (ratio < 0.1) return 95;
  if (ratio >= 0.1 && ratio < 0.2) return 80;
  if (ratio >= 0.2 && ratio < 0.3) return 65;
  if (ratio >= 0.3 && ratio < 0.4) return 50;
  if (ratio >= 0.4 && ratio < 0.6) return 35;
  return 15;
}

function getSectorScore(issuerType) {
  return SECTOR_SCORES[issuerType] ?? 58;
}

function getGroupSupportScore(groupSupport) {
  return GROUP_SUPPORT_SCORES[groupSupport] ?? 58;
}

function getEventScore(events = {}) {
  let score = 100;

  if (events.minorDowngrade) score -= 10;
  if (events.majorDowngrade) score -= 20;
  if (events.onePaymentDelay) score -= 20;
  if (events.multipleDelays) score -= 35;
  if (events.defaultIn3Yrs) score -= 50;
  if (events.auditorQualification) score -= 10;
  if (events.regulatoryAction) score -= 15;

  return Math.max(0, score);
}

export function getIssuerScore(data) {
  const icrScore = getICRScore(data.ebitda, data.interestExpense);
  const leverageScore = getLeverageScore(data.totalDebt, data.ebitda);
  const cashflowScore = getCashflowScore(data.operatingCashFlow, data.ebitda);
  const refinancingScore = getRefinancingScore(data.debtDue12m, data.totalDebt);
  const sectorScore = getSectorScore(data.issuerType);
  const groupScore = getGroupSupportScore(data.groupSupport);
  const eventScore = getEventScore(data.events);
  const w = ISSUER_WEIGHTS;

  const issuerScore =
    w.icr * icrScore +
    w.leverage * leverageScore +
    w.cashflow * cashflowScore +
    w.refinancing * refinancingScore +
    w.sector * sectorScore +
    w.groupSupport * groupScore +
    w.events * eventScore;

  return Math.round(issuerScore);
}
