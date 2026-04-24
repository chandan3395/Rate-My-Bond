// finalScore = 0.35 * issuerScore
//            + 0.20 * structureScore
//            + 0.15 * liquidityScore
//            + 0.15 * returnScore
//            + 0.15 * fitScore

import { getFitScore } from "./fitScorer.js";
import { getIssuerScore } from "./scoringEngine.js";
import { getExpectedLoss } from "./expectedLoss.js";
import {
  INSTRUMENT_SCORES,
  LIQUIDITY_SCORES,
  SECURITY_SCORES,
} from "../modelConfig.js";

export function analyzeBond(data) {
  const issuerScore = getIssuerScore(data);

  const structureScore =
    ((INSTRUMENT_SCORES[data.instrumentType] ?? 58) +
      (SECURITY_SCORES[data.securityType] ?? 58)) /
    2;

  const liquidityScore = LIQUIDITY_SCORES[data.liquidity] ?? 55;

  const { expectedLoss, riskAdjustedReturn } = getExpectedLoss(data);
  let returnScore = 0;
  if (riskAdjustedReturn > 0.06) returnScore = 90;
  else if (riskAdjustedReturn > 0.04) returnScore = 75;
  else if (riskAdjustedReturn > 0.02) returnScore = 60;
  else if (riskAdjustedReturn > 0) returnScore = 45;
  else returnScore = 25;

  const fitScore = getFitScore(data, issuerScore);

  const finalScore = Math.round(
    0.35 * issuerScore +
      0.2 * structureScore +
      0.15 * liquidityScore +
      0.15 * returnScore +
      0.15 * fitScore,
  );

  let ratingBand = "";
  if (finalScore >= 80) ratingBand = "AAA";
  else if (finalScore >= 70) ratingBand = "AA";
  else if (finalScore >= 60) ratingBand = "A";
  else if (finalScore >= 50) ratingBand = "BBB";
  else if (finalScore >= 45) ratingBand = "BB";
  else ratingBand = "B/Junk";

  return {
    issuerScore,
    structureScore,
    liquidityScore,
    returnScore,
    fitScore,
    finalScore,
    ratingBand,
    expectedLoss,
    riskAdjustedReturn,
  };
}
