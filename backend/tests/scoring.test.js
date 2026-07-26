import { describe, it, expect } from 'vitest';

import { analyzeBond } from '../src/services/finalScorer.js';
import { getIssuerScore } from '../src/services/scoringEngine.js';
import { getPD } from '../src/services/pdCalculator.js';
import { getLGD } from '../src/services/lgdCalculator.js';
import { getExpectedLoss } from '../src/services/expectedLoss.js';
import { getFitScore } from '../src/services/fitScorer.js';
import { ISSUER_WEIGHTS } from '../src/modelConfig.js';
import { baseInput } from './fixtures.js';

describe('weights', () => {
  it('issuer sub-factor weights sum to 1', () => {
    const sum = Object.values(ISSUER_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});

describe('getIssuerScore', () => {
  it('computes the weighted issuer score for known inputs', () => {
    // ICR 5->95, leverage 2.5->80, cashflow 0.85->80, refi 0.08->95,
    // sector 90, group 75, events 100
    // = .25*95 + .2*80 + .15*80 + .15*95 + .1*90 + .1*75 + .05*100 = 87.5 -> 88
    expect(getIssuerScore(baseInput)).toBe(88);
  });

  it('falls back to neutral sub-scores when financials are missing', () => {
    const score = getIssuerScore({
      issuerType: 'Not sure',
      groupSupport: 'Standalone',
    });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('getPD', () => {
  it('uses the base PD for the credit rating', () => {
    expect(getPD(baseInput)).toBeCloseTo(0.01, 6);
  });

  it('adds risk for NBFC issuers', () => {
    expect(getPD({ ...baseInput, issuerType: 'NBFC' })).toBeCloseTo(0.03, 6);
  });

  it('clamps to a floor of 0.001 for the safest issuers', () => {
    const pd = getPD({
      ...baseInput,
      creditRating: 'AAA',
      groupSupport: 'Government owned',
    });
    expect(pd).toBeCloseTo(0.001, 6);
  });
});

describe('getLGD', () => {
  it('applies recovery base + instrument adjustment', () => {
    // Secured 0.65 + Secured NCD 0.05 = 0.70 recovery -> LGD 0.30
    expect(getLGD(baseInput)).toBeCloseTo(0.3, 6);
  });

  it('treats unknown security as full loss', () => {
    expect(getLGD({ securityType: 'Mystery', instrumentType: 'Mystery' })).toBe(
      1,
    );
  });
});

describe('getExpectedLoss', () => {
  it('returns PD*LGD and the risk-adjusted return', () => {
    const { expectedLoss, liquidityPenalty, riskAdjustedReturn } =
      getExpectedLoss(baseInput);
    expect(expectedLoss).toBeCloseTo(0.003, 6); // 0.01 * 0.30
    expect(liquidityPenalty).toBeCloseTo(0.005, 6); // Moderate
    expect(riskAdjustedReturn).toBeCloseTo(0.076, 6); // 0.084 - 0.003 - 0.005
  });
});

describe('getFitScore', () => {
  it('blends horizon/risk/income/liquidity matches', () => {
    // horizon 92, risk(Balanced, quality 88) 86, income(Regular+Quarterly) 90,
    // liquidity(Moderate) 70 -> .35*92 + .25*86 + .2*90 + .2*70 = 85.7 -> 86
    expect(getFitScore(baseInput, 88)).toBe(86);
  });
});

describe('analyzeBond', () => {
  it('produces the full breakdown for a known bond', () => {
    const result = analyzeBond(baseInput);

    expect(result.issuerScore).toBe(88);
    expect(result.structureScore).toBe(83); // (82 + 84) / 2
    expect(result.liquidityScore).toBe(66); // Moderate
    expect(result.returnScore).toBe(90); // rar 0.076 > 0.06
    expect(result.fitScore).toBe(86);
    expect(result.finalScore).toBe(84); // weighted round
    expect(result.ratingBand).toBe('AAA'); // >= 80
    expect(result.expectedLoss).toBeCloseTo(0.003, 6);
    expect(result.riskAdjustedReturn).toBeCloseTo(0.076, 6);
  });

  it('keeps the final score within 0..100', () => {
    const result = analyzeBond(baseInput);
    expect(result.finalScore).toBeGreaterThanOrEqual(0);
    expect(result.finalScore).toBeLessThanOrEqual(100);
  });
});
