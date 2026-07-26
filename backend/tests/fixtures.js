// A fully-specified, deterministic bond input shared by unit + integration
// tests. Every derived score in scoring.test.js is hand-computed from
// modelConfig.js for this exact input.
export const baseInput = {
  amount: 150000,
  interestRate: 8.4,
  horizon: '3 - 5 years',
  riskProfile: 'Balanced',
  returnPreference: 'Regular Income',
  issuer: 'Test Issuer',
  issuerType: 'PSU / Utility',
  creditRating: 'AA',
  instrumentType: 'Secured NCD',
  securityType: 'Secured',
  tenure: '3 - 5 years',
  payoutType: 'Quarterly',
  liquidity: 'Moderate',
  // financials driving the issuer score
  ebitda: 1000,
  interestExpense: 200,
  totalDebt: 2500,
  operatingCashFlow: 850,
  debtDue12m: 200,
  groupSupport: 'Large group',
};

export default baseInput;
