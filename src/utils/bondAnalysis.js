import { requiredFieldIds } from "../constants/formConstants";
import { safeNumber } from "../helpers/errorHandlers";
import { isValuePresent } from "../helpers/validation";

const ratingScoreMap = {
  AAA: 96,
  "AA+": 90,
  AA: 86,
  "AA-": 82,
  "A+": 77,
  A: 73,
  "A-": 69,
  "BBB+": 63,
  BBB: 59,
  "BBB-": 55,
  "BB and below": 40,
  "Not sure": 58,
};

const issuerTypeScoreMap = {
  "PSU / Utility": 88,
  Infrastructure: 72,
  NBFC: 64,
  "Manufacturing / Logistics": 68,
  "Financial Services": 61,
  "Real Estate": 48,
  "Not sure": 58,
};

const instrumentScoreMap = {
  "Secured NCD": 82,
  "Unsecured NCD": 56,
  MLD: 45,
  "Not sure": 58,
};

const securityScoreMap = {
  Secured: 84,
  "Partially Secured": 68,
  Unsecured: 48,
  "Not sure": 58,
};

const tenureScoreMap = {
  "< 3 years": 84,
  "3 - 5 years": 76,
  "5 - 10 years": 62,
  "> 10 years": 44,
};

const liquidityScoreMap = {
  "Easy to exit": 84,
  Moderate: 66,
  "Hard to exit": 42,
  "Not sure": 55,
};

const issueSizeScoreMap = {
  Small: 48,
  Medium: 66,
  Large: 80,
  "Not sure": 58,
};

const DEFAULT_SCORE = 58;
const SCORE_MIN = 0;
const SCORE_MAX = 100;

function clamp(value) {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, value));
}

function getLookupScore(scoreMap, value, fallback = DEFAULT_SCORE) {
  return scoreMap[value] ?? fallback;
}

function getAverageScore(items, fallback = DEFAULT_SCORE) {
  if (!items.length) {
    return fallback;
  }

  return Math.round(
    items.reduce((sum, item) => sum + item.score, 0) / items.length,
  );
}

function getInterestRateScore(rate) {
  if (!rate) return DEFAULT_SCORE;
  if (rate <= 7) return 88;
  if (rate <= 9) return 76;
  if (rate <= 11) return 62;
  if (rate <= 13) return 48;
  return 34;
}

function getHorizonTenureFit(horizon, tenure) {
  const matrix = {
    "< 1 year": { "< 3 years": 82, "3 - 5 years": 54, "5 - 10 years": 30, "> 10 years": 10 },
    "1 - 3 years": { "< 3 years": 90, "3 - 5 years": 70, "5 - 10 years": 38, "> 10 years": 18 },
    "3 - 5 years": { "< 3 years": 68, "3 - 5 years": 92, "5 - 10 years": 64, "> 10 years": 30 },
    "5+ years": { "< 3 years": 55, "3 - 5 years": 78, "5 - 10 years": 90, "> 10 years": 68 },
  };

  return matrix[horizon]?.[tenure] ?? DEFAULT_SCORE;
}

function getRiskProfileFit(riskProfile, qualityScore) {
  if (riskProfile === "Conservative") return qualityScore >= 80 ? 92 : qualityScore >= 65 ? 58 : 26;
  if (riskProfile === "Balanced") return qualityScore >= 70 ? 86 : qualityScore >= 55 ? 72 : 42;
  return qualityScore >= 45 ? 84 : DEFAULT_SCORE;
}

function getPayoutFit(returnPreference, payoutType) {
  if (returnPreference === "Regular Income") {
    return ["Monthly", "Quarterly", "Annual"].includes(payoutType) ? 90 : 42;
  }
  if (returnPreference === "Maturity Focused") {
    return payoutType === "Cumulative" ? 92 : DEFAULT_SCORE;
  }
  return payoutType === "Quarterly" || payoutType === "Cumulative" ? 82 : 70;
}

function getAmountSignal(amount, qualityScore) {
  if (!amount) return 0;
  if (amount >= 500000 && qualityScore < 55) return -8;
  if (amount >= 250000 && qualityScore < 65) return -4;
  return 0;
}

export function getBondRatingBand(score) {
  if (score >= 85) return "AAA";
  if (score >= 75) return "AA";
  if (score >= 65) return "A";
  if (score >= 55) return "BBB";
  if (score >= 45) return "BB";
  return "B / Junk";
}

export function getBondRatingTone(rating) {
  switch (rating) {
    case "AAA":
      return "text-[#8fd7cf]";
    case "AA":
      return "text-[#b7ebe6]";
    case "A":
      return "text-[#d8f5f1]";
    case "BBB":
      return "text-[#f2e6aa]";
    case "BB":
      return "text-[#f4c98d]";
    default:
      return "text-[#f4a6a6]";
  }
}

export function analyzeBond(values = {}) {
  const missingRequired = requiredFieldIds.filter(
    (fieldId) => !isValuePresent(values[fieldId]),
  );

  const interestRate = safeNumber(values.interestRate, 0);
  const amount = safeNumber(values.amount, 0);

  const bondQualityBreakdown = [
    { label: "Credit rating", score: getLookupScore(ratingScoreMap, values.creditRating) },
    { label: "Issuer type", score: getLookupScore(issuerTypeScoreMap, values.issuerType) },
    { label: "Instrument type", score: getLookupScore(instrumentScoreMap, values.instrumentType) },
    { label: "Security", score: getLookupScore(securityScoreMap, values.securityType) },
    { label: "Tenure", score: getLookupScore(tenureScoreMap, values.tenure) },
    { label: "Liquidity", score: getLookupScore(liquidityScoreMap, values.liquidity, 55) },
    { label: "Issue size", score: getLookupScore(issueSizeScoreMap, values.issueSize) },
    { label: "Interest rate", score: getInterestRateScore(interestRate) },
  ];

  const bondQualityScore = getAverageScore(bondQualityBreakdown);

  const fitBreakdown = [
    { label: "Horizon match", score: getHorizonTenureFit(values.horizon, values.tenure) },
    { label: "Risk match", score: getRiskProfileFit(values.riskProfile, bondQualityScore) },
    { label: "Payout fit", score: getPayoutFit(values.returnPreference, values.payoutType) },
  ];

  const fitScore = getAverageScore(fitBreakdown);

  const amountAdjustment = getAmountSignal(amount, bondQualityScore);
  const overallScore = clamp(
    Math.round(bondQualityScore * 0.65 + fitScore * 0.35 + amountAdjustment),
  );
  const ratingBand = getBondRatingBand(overallScore);

  const narrative = [];

  if (overallScore >= 75) {
    narrative.push(
      "This bond appears broadly suitable for your profile and sits in a relatively stronger risk bucket.",
    );
  } else if (overallScore >= 60) {
    narrative.push(
      "This bond can work for your profile, but it comes with moderate risk and should be considered carefully.",
    );
  } else {
    narrative.push(
      "This bond looks riskier for your profile and deserves extra caution before you commit capital.",
    );
  }

  if (fitBreakdown[0].score >= 80) {
    narrative.push(
      "The maturity broadly matches your investment horizon, which is a positive fit signal.",
    );
  } else {
    narrative.push(
      "The bond maturity does not align neatly with your stated horizon, so duration fit is weaker.",
    );
  }

  if (interestRate >= 11) {
    narrative.push(
      "The interest rate is on the higher side, which can indicate additional risk rather than free extra return.",
    );
  } else {
    narrative.push(
      "The interest rate is not excessively stretched relative to the bond structure, which supports stability.",
    );
  }

  if (values.liquidity === "Hard to exit") {
    narrative.push(
      "Liquidity looks limited, so selling before maturity may be difficult if your situation changes.",
    );
  } else if (values.liquidity === "Moderate") {
    narrative.push(
      "Liquidity is not ideal, so early exit may still require patience or a pricing discount.",
    );
  }

  if (values.instrumentType === "MLD") {
    narrative.push(
      "Because this is a market-linked structure, complexity is higher and the return path may be less straightforward for beginners.",
    );
  }

  return {
    missingRequired,
    bondQualityScore,
    fitScore,
    overallScore,
    ratingBand,
    bondQualityBreakdown,
    fitBreakdown,
    narrative,
  };
}
