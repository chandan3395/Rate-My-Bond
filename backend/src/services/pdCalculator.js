// This calculates Probability of Default. How likely is the company to actually fail to repay.

import { BASE_PD } from "../modelConfig.js";

export function getPD(data) {
  let basePD = BASE_PD[data.creditRating] ?? 0.05;

  if (data.issuerType === "NBFC" || data.issuerType === "Real Estate") {
    basePD += 0.02;
  }
  if (data.totalDebt / data.ebitda > 6) {
    basePD += 0.015;
  }
  if (data.debtDue12m / data.totalDebt > 0.4) {
    basePD += 0.02;
  }
  if (
    data.groupSupport === "Government owned" ||
    data.groupSupport === "AAA parent"
  ) {
    basePD -= 0.008;
  }

  return Math.max(0.001, Math.min(0.99, basePD));
}
