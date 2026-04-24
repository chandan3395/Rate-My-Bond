// expectedLoss = PD × LGD
// riskAdjustedReturn = (interestRate / 100) - expectedLoss - liquidityPenalty

import { LIQUIDITY_PENALTY } from "../modelConfig.js";
import { getLGD } from "./lgdCalculator.js";
import { getPD } from "./pdCalculator.js";

export function getExpectedLoss(data) {
  const PD = getPD(data);
  const LGD = getLGD(data);
  const expectedLoss = PD * LGD;
  const liquidityPenalty = LIQUIDITY_PENALTY[data.liquidity] ?? 0;

  const riskAdjustedReturn =
    data.interestRate / 100 - expectedLoss - liquidityPenalty;

  return { expectedLoss, liquidityPenalty, riskAdjustedReturn };
}
