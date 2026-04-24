export const ISSUER_WEIGHTS = {
  icr: 0.25,
  leverage: 0.2,
  cashflow: 0.15,
  refinancing: 0.15,
  sector: 0.1,
  groupSupport: 0.1,
  events: 0.05,
};

export const SECTOR_SCORES = {
  "PSU / Utility": 90,
  Infrastructure: 55,
  "Manufacturing / Logistics": 70,
  NBFC: 65,
  "Housing Finance": 60,
  "Real Estate": 45,
  "Financial Services": 61,
  "Not sure": 58,
};

export const GROUP_SUPPORT_SCORES = {
  "Government owned": 95,
  "AAA parent": 85,
  "Large group": 75,
  "Mid group": 60,
  Standalone: 45,
  "Weak promoter": 30,
};

export const BASE_PD = {
  AAA: 0.005,
  "AA+": 0.008,
  AA: 0.01,
  "AA-": 0.013,
  "A+": 0.018,
  A: 0.023,
  "A-": 0.03,
  "BBB+": 0.042,
  BBB: 0.055,
  "BBB-": 0.07,
  "BB and below": 0.15,
  "Not sure": 0.05,
};

export const LGD_RECOVERY_BASE = {
  Secured: 0.65,
  "Partially Secured": 0.45,
  Unsecured: 0.25,
  "Not sure": 0.4,
};

export const LGD_INSTRUMENT_ADJUST = {
  "Secured NCD": 0.05,
  "Unsecured NCD": 0,
  MLD: -0.1,
  "Not sure": 0,
};

export const LIQUIDITY_PENALTY = {
  "Easy to exit": 0,
  Moderate: 0.005,
  "Hard to exit": 0.02,
  "Not sure": 0.01,
};

export const INSTRUMENT_SCORES = {
  "Secured NCD": 82,
  "Unsecured NCD": 56,
  MLD: 45,
  "Not sure": 58,
};

export const SECURITY_SCORES = {
  Secured: 84,
  "Partially Secured": 68,
  Unsecured: 48,
  "Not sure": 58,
};

export const LIQUIDITY_SCORES = {
  "Easy to exit": 84,
  Moderate: 66,
  "Hard to exit": 42,
  "Not sure": 55,
};
