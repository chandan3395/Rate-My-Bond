export const issuerOptions = [
  "Aditya Infra Finance",
  "Apex Power Grid",
  "BlueRiver Logistics",
  "Crest Housing Finance",
  "Evergreen Renewables",
  "Metro Rail Holdings",
  "Northstar Utilities",
  "Summit Leasing",
];

export const requiredSections = [
  {
    id: "issuerBasics",
    title: "Issuer Basics",
    description: "Core issuer identity and external credit view.",
    fields: [
      {
        id: "issuerName",
        label: "Issuer Name",
        type: "searchable",
        placeholder: "Search issuer from the database",
      },
      {
        id: "creditRating",
        label: "Credit Rating",
        type: "select",
        group: "financialStrength",
        options: [
          { label: "AAA", score: 5 },
          { label: "AA+", score: 4.8 },
          { label: "AA", score: 4.6 },
          { label: "AA-", score: 4.4 },
          { label: "A+", score: 4 },
          { label: "A", score: 3.7 },
          { label: "A-", score: 3.4 },
          { label: "BBB+", score: 3 },
          { label: "BBB", score: 2.7 },
          { label: "BBB-", score: 2.4 },
          { label: "BB and below", score: 1.2 },
        ],
      },
    ],
  },
  {
    id: "financialStrength",
    title: "Financial Strength",
    description: "Relative leverage, profitability, and earnings resilience.",
    fields: [
      {
        id: "totalDebtLevel",
        label: "Total Debt Level",
        type: "select",
        group: "financialStrength",
        options: [
          { label: "Very Low", score: 5 },
          { label: "Low", score: 4 },
          { label: "Moderate", score: 3 },
          { label: "High", score: 1.5 },
          { label: "Very High", score: 0.5 },
        ],
      },
      {
        id: "ebitdaStrength",
        label: "EBITDA Strength",
        type: "select",
        group: "financialStrength",
        options: [
          { label: "Very Strong", score: 5 },
          { label: "Strong", score: 4 },
          { label: "Moderate", score: 3 },
          { label: "Weak", score: 1.5 },
          { label: "Very Weak", score: 0.5 },
        ],
      },
      {
        id: "netProfitStability",
        label: "Net Profit Stability",
        type: "select",
        group: "financialStrength",
        options: [
          { label: "Consistent Growth", score: 5 },
          { label: "Stable", score: 4 },
          { label: "Slightly Volatile", score: 2.8 },
          { label: "Highly Volatile", score: 1.2 },
          { label: "Loss Making", score: 0.2 },
        ],
      },
    ],
  },
  {
    id: "keyRatios",
    title: "Key Ratios",
    description: "Leverage and debt-servicing quality indicators.",
    fields: [
      {
        id: "debtToEquity",
        label: "Debt-to-Equity (D/E)",
        type: "select",
        group: "ratios",
        options: [
          { label: "< 0.5", score: 5 },
          { label: "0.5 - 1", score: 4 },
          { label: "1 - 2", score: 3 },
          { label: "2 - 3", score: 1.8 },
          { label: "> 3", score: 0.4 },
        ],
      },
      {
        id: "interestCoverageRatio",
        label: "Interest Coverage Ratio (ICR)",
        type: "select",
        group: "ratios",
        options: [
          { label: "> 5", score: 5 },
          { label: "3 - 5", score: 4 },
          { label: "2 - 3", score: 3 },
          { label: "1 - 2", score: 1.5 },
          { label: "< 1", score: 0.2 },
        ],
      },
      {
        id: "debtServiceCoverageRatio",
        label: "Debt Service Coverage Ratio (DSCR)",
        type: "select",
        group: "ratios",
        options: [
          { label: "> 2", score: 5 },
          { label: "1.5 - 2", score: 4 },
          { label: "1.2 - 1.5", score: 3 },
          { label: "1 - 1.2", score: 1.6 },
          { label: "< 1", score: 0.2 },
        ],
      },
    ],
  },
  {
    id: "bondDetails",
    title: "Bond Details",
    description: "Bond structure, pricing, and repayment profile.",
    fields: [
      {
        id: "bondSize",
        label: "Bond Size",
        type: "select",
        group: "bondStructure",
        options: [
          { label: "Small (< INR 100 Cr)", score: 2.5 },
          { label: "Medium (INR 100-500 Cr)", score: 4 },
          { label: "Large (> INR 500 Cr)", score: 5 },
        ],
      },
      {
        id: "couponRate",
        label: "Coupon Rate",
        type: "select",
        group: "bondStructure",
        options: [
          { label: "< 6%", score: 5 },
          { label: "6 - 8%", score: 4 },
          { label: "8 - 10%", score: 3 },
          { label: "10 - 12%", score: 1.6 },
          { label: "> 12%", score: 0.5 },
        ],
      },
      {
        id: "tenure",
        label: "Tenure",
        type: "select",
        group: "bondStructure",
        options: [
          { label: "< 3 years", score: 5 },
          { label: "3 - 5 years", score: 4 },
          { label: "5 - 10 years", score: 3 },
          { label: "> 10 years", score: 1.4 },
        ],
      },
      {
        id: "repaymentType",
        label: "Repayment Type",
        type: "select",
        group: "bondStructure",
        options: [
          { label: "Bullet", score: 2.5 },
          { label: "Amortizing", score: 5 },
        ],
      },
    ],
  },
  {
    id: "cashFlow",
    title: "Cash Flow",
    description: "Operating cash support available to the bond.",
    fields: [
      {
        id: "operatingCashFlowStrength",
        label: "Operating Cash Flow Strength",
        type: "select",
        group: "cashFlow",
        options: [
          { label: "Very Strong", score: 5 },
          { label: "Strong", score: 4 },
          { label: "Moderate", score: 3 },
          { label: "Weak", score: 1.5 },
          { label: "Negative", score: 0.1 },
        ],
      },
    ],
  },
  {
    id: "riskIndicator",
    title: "Risk Indicator",
    description: "Historical default behavior and payment reliability.",
    fields: [
      {
        id: "defaultHistory",
        label: "Default History",
        type: "select",
        group: "riskFlags",
        options: [
          { label: "No Defaults", score: 5 },
          { label: "Minor Delays", score: 2.5 },
          { label: "Past Default", score: 0.2 },
        ],
      },
    ],
  },
];

export const optionalSections = [
  {
    id: "liquidityReserves",
    title: "Liquidity & Reserves",
    fields: [
      {
        id: "cashReserves",
        label: "Cash Reserves",
        type: "select",
        options: [
          { label: "Very High", score: 5 },
          { label: "High", score: 4 },
          { label: "Moderate", score: 3 },
          { label: "Low", score: 1.5 },
          { label: "Very Low", score: 0.5 },
        ],
      },
    ],
  },
  {
    id: "collateralSecurity",
    title: "Collateral / Security",
    fields: [
      {
        id: "securityType",
        label: "Security Type",
        type: "select",
        options: [
          { label: "Fully Secured", score: 5 },
          { label: "Partially Secured", score: 3 },
          { label: "Unsecured", score: 0.8 },
        ],
      },
      {
        id: "ltv",
        label: "LTV (Loan-to-Value)",
        type: "select",
        options: [
          { label: "< 50%", score: 5 },
          { label: "50 - 70%", score: 4 },
          { label: "70 - 90%", score: 2 },
          { label: "> 90%", score: 0.4 },
        ],
      },
    ],
  },
  {
    id: "businessStrength",
    title: "Business Strength",
    fields: [
      {
        id: "industryRisk",
        label: "Industry Risk",
        type: "select",
        options: [
          { label: "Low Risk (e.g., utilities)", score: 5 },
          { label: "Moderate Risk", score: 3 },
          { label: "High Risk (e.g., startups, cyclical)", score: 1 },
        ],
      },
      {
        id: "marketPosition",
        label: "Market Position",
        type: "select",
        options: [
          { label: "Market Leader", score: 5 },
          { label: "Strong Player", score: 4 },
          { label: "Average", score: 2.8 },
          { label: "Weak", score: 1 },
        ],
      },
    ],
  },
  {
    id: "behavioralSignals",
    title: "Behavioral Signals",
    fields: [
      {
        id: "paymentDiscipline",
        label: "Payment Discipline",
        type: "select",
        options: [
          { label: "Always On Time", score: 5 },
          { label: "Occasional Delays", score: 2.5 },
          { label: "Frequent Delays", score: 0.5 },
        ],
      },
      {
        id: "ratingTrend",
        label: "Rating Trend",
        type: "select",
        options: [
          { label: "Improving", score: 5 },
          { label: "Stable", score: 3.5 },
          { label: "Deteriorating", score: 1 },
        ],
      },
    ],
  },
];

export const groupWeights = {
  financialStrength: 40,
  ratios: 25,
  cashFlow: 20,
  bondStructure: 10,
  riskFlags: 5,
};

export const sampleProfile = {
  issuerName: "Northstar Utilities",
  creditRating: "AA",
  totalDebtLevel: "Low",
  ebitdaStrength: "Strong",
  netProfitStability: "Stable",
  debtToEquity: "0.5 - 1",
  interestCoverageRatio: "3 - 5",
  debtServiceCoverageRatio: "1.5 - 2",
  bondSize: "Large (> INR 500 Cr)",
  couponRate: "6 - 8%",
  tenure: "3 - 5 years",
  repaymentType: "Amortizing",
  operatingCashFlowStrength: "Strong",
  defaultHistory: "No Defaults",
  cashReserves: "High",
  securityType: "Fully Secured",
  ltv: "50 - 70%",
  industryRisk: "Low Risk (e.g., utilities)",
  marketPosition: "Market Leader",
  paymentDiscipline: "Always On Time",
  ratingTrend: "Stable",
};
