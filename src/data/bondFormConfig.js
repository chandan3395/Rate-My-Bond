export const issuerCatalog = {
  "Northstar Utilities": {
    issuerType: "PSU / Utility",
    creditRating: "AA",
    interestRate: 8.4,
    issueSize: "Large",
    securityType: "Secured",
  },
  "Apex Power Grid": {
    issuerType: "Infrastructure",
    creditRating: "AA-",
    interestRate: 9.1,
    issueSize: "Large",
    securityType: "Secured",
  },
  "Crest Housing Finance": {
    issuerType: "NBFC",
    creditRating: "A+",
    interestRate: 10.2,
    issueSize: "Medium",
    securityType: "Secured",
  },
  "BlueRiver Logistics": {
    issuerType: "Manufacturing / Logistics",
    creditRating: "A",
    interestRate: 9.8,
    issueSize: "Medium",
    securityType: "Partially Secured",
  },
  "Evergreen Renewables": {
    issuerType: "Infrastructure",
    creditRating: "BBB+",
    interestRate: 11.1,
    issueSize: "Small",
    securityType: "Partially Secured",
  },
};

export const riskProfileOptions = [
  {
    label: "Conservative",
    sublabel: "Prefer stability and lower downside risk",
    value: "Conservative",
  },
  {
    label: "Balanced",
    sublabel: "Comfortable with moderate risk for better returns",
    value: "Balanced",
  },
  {
    label: "Aggressive",
    sublabel: "Can tolerate volatility for higher return potential",
    value: "Aggressive",
  },
];

export const returnPreferenceOptions = [
  { label: "Regular Income", value: "Regular Income" },
  { label: "Balanced", value: "Balanced" },
  { label: "Maturity Focused", value: "Maturity Focused" },
];

const creditRatingBadgeMap = {
  AAA: "bg-[#67d391]/15 text-[#b6efc7] border-[#67d391]/25",
  "AA+": "bg-[#7edba9]/15 text-[#c6f2d5] border-[#7edba9]/25",
  AA: "bg-[#8fd7cf]/15 text-[#d5f5f1] border-[#8fd7cf]/25",
  "AA-": "bg-[#8fd7cf]/15 text-[#d5f5f1] border-[#8fd7cf]/25",
  "A+": "bg-[#d5f2de]/15 text-[#e4f8ea] border-[#d5f2de]/25",
  A: "bg-[#d5f2de]/15 text-[#e4f8ea] border-[#d5f2de]/25",
  "A-": "bg-[#d5f2de]/15 text-[#e4f8ea] border-[#d5f2de]/25",
  "BBB+": "bg-[#f2c66d]/15 text-[#f6dfb2] border-[#f2c66d]/25",
  BBB: "bg-[#f2c66d]/15 text-[#f6dfb2] border-[#f2c66d]/25",
  "BBB-": "bg-[#f2c66d]/15 text-[#f6dfb2] border-[#f2c66d]/25",
  "BB and below": "bg-[#f39a8d]/15 text-[#f7c1b8] border-[#f39a8d]/25",
  "Not sure": "bg-white/5 text-white/65 border-white/10",
};

export const userIntentFields = [
  {
    id: "amount",
    label: "How much do you want to invest?",
    type: "amount",
    required: true,
    tooltip: "How much capital you want to put into this bond.",
    meaning: "How much capital you plan to allocate to this bond.",
    details:
      "This does not directly change bond quality, but it affects concentration risk. Larger allocations to risky bonds deserve more caution.",
    example: "INR 100000 into a bond with low liquidity means exit flexibility matters more.",
    howToChoose:
      "Enter the actual amount you may invest, even if it is only a trial estimate.",
    backendNote: "Used for exposure checks and suitability warnings.",
    min: 10000,
    max: 1000000,
    step: 10000,
    notSureValue: 100000,
    autoValue: 250000,
  },
  {
    id: "horizon",
    label: "How long can you stay invested?",
    type: "dropdown",
    required: true,
    tooltip: "How long you can realistically stay invested without needing the money back.",
    meaning: "How long you can realistically stay invested without needing the money back.",
    details:
      "A mismatch between your horizon and the bond tenure increases risk, especially if liquidity is weak.",
    example: "A 2-year goal usually should not be matched with a 7-year bond.",
    howToChoose:
      "Pick the closest real-world time period you can commit to.",
    backendNote: "Used for duration fit scoring.",
    options: ["< 1 year", "1 - 3 years", "3 - 5 years", "5+ years"],
    notSureValue: "3 - 5 years",
    autoValue: "3 - 5 years",
  },
  {
    id: "riskProfile",
    label: "What level of risk are you comfortable with?",
    type: "cards",
    required: true,
    tooltip: "Your comfort level with default risk and price uncertainty.",
    meaning: "Your comfort level with default risk and price uncertainty.",
    details:
      "Higher-yield bonds can look attractive, but they may be a poor fit if you prefer low-risk investing.",
    example: "A conservative investor may reject a BBB bond even if the coupon is high.",
    howToChoose:
      "Choose based on how much loss or uncertainty you can tolerate emotionally and financially.",
    backendNote: "Used as a suitability filter.",
    options: riskProfileOptions,
    notSureValue: "Balanced",
    autoValue: "Balanced",
  },
  {
    id: "returnPreference",
    label: "How do you want returns?",
    type: "toggle",
    required: true,
    tooltip: "Whether you want regular income or returns at maturity.",
    meaning: "Whether you need regular income or prefer returns at maturity.",
    details:
      "Monthly or quarterly payouts help income-focused investors, while cumulative structures suit those who can wait.",
    example: "If you want monthly cashflow, a cumulative payout bond may not fit.",
    howToChoose:
      "Pick the return pattern that matches how you actually plan to use the money.",
    backendNote: "Used for payout matching.",
    options: returnPreferenceOptions,
    notSureValue: "Balanced",
    autoValue: "Balanced",
  },
];

export const bondDetailFields = [
  {
    id: "issuer",
    label: "Issuer name",
    type: "search",
    required: true,
    tooltip: "The company you are lending money to.",
    meaning: "The legal entity issuing the bond.",
    details:
      "Issuer quality is one of the strongest indicators of repayment reliability. Once selected, other fields can be auto-detected from issuer data.",
    example: "A large PSU and a small NBFC can have very different risk even if coupons look similar.",
    howToChoose:
      "Search the issuer name exactly as shown on the bond listing. Once selected, the system can auto-fill the connected fields.",
    backendNote: "Pulls issuer-linked financial and risk data for enrichment.",
    options: Object.keys(issuerCatalog),
    notSureValue: "Northstar Utilities",
    autoValue: "Northstar Utilities",
  },
  {
    id: "issuerType",
    label: "Issuer type",
    type: "dropdown",
    required: true,
    tooltip: "What kind of company the issuer is.",
    meaning: "The category of company issuing the bond.",
    details:
      "PSU issuers are often government-linked and generally safer. NBFCs carry moderate risk. Real estate and stressed sectors can be riskier.",
    example: "NBFC bonds may offer higher returns because sector risk is higher.",
    howToChoose:
      "This is usually auto-filled after you select the issuer. Change it only if the listing clearly shows something different.",
    backendNote: "Sector risk multiplier.",
    options: [
      "PSU / Utility",
      "NBFC",
      "Manufacturing / Logistics",
      "Infrastructure",
      "Real Estate",
      "Financial Services",
      "Not sure",
    ],
    notSureValue: "Not sure",
    autoValue: (values) => issuerCatalog[values.issuer]?.issuerType || "Not sure",
  },
  {
    id: "creditRating",
    label: "Credit rating",
    type: "dropdown",
    required: true,
    tooltip: "How safe the bond is considered by rating agencies.",
    meaning: "A shorthand signal of the issuer's repayment strength.",
    details:
      "Credit rating reflects the issuer's ability to repay. AAA means very strong repayment ability. Lower ratings mean higher default risk, and ratings can change over time.",
    example:
      "An AA bond at 9% versus an A bond at 11% usually means the higher return comes with higher risk.",
    howToChoose:
      "Copy the rating from the bond page. If you do not see it clearly, use Not sure and let the system estimate.",
    backendNote: "Maps to the base default probability proxy.",
    options: [
      "AAA",
      "AA+",
      "AA",
      "AA-",
      "A+",
      "A",
      "A-",
      "BBB+",
      "BBB",
      "BBB-",
      "BB and below",
      "Not sure",
    ],
    badgeMap: creditRatingBadgeMap,
    badgeLegend: ["AAA", "AA", "A", "BBB", "BB and below", "Not sure"],
    notSureValue: "Not sure",
    autoValue: (values) =>
      issuerCatalog[values.issuer]?.creditRating || "Not sure",
  },
  {
    id: "instrumentType",
    label: "Type of bond",
    type: "cards",
    required: true,
    tooltip: "What kind of bond structure this is.",
    meaning: "The structural format of the instrument.",
    details:
      "Secured NCDs are backed by assets and are usually easier to understand. Unsecured NCDs have no asset backing and carry higher risk. MLDs are market-linked, so returns depend on market conditions and the structure is more complex.",
    example:
      "An MLD may pay attractive returns only if a market condition is met.",
    howToChoose:
      "Copy the bond type directly from the listing. If the structure is unclear, use Auto-detect.",
    backendNote: "Adds structure complexity and risk penalties.",
    options: [
      {
        label: "Secured NCD",
        sublabel: "Asset-backed and simpler to interpret",
        value: "Secured NCD",
      },
      {
        label: "Unsecured NCD",
        sublabel: "Higher risk with no direct asset backing",
        value: "Unsecured NCD",
      },
      {
        label: "MLD",
        sublabel: "Returns depend on market-linked conditions",
        value: "MLD",
      },
      {
        label: "Not sure",
        sublabel: "Let the system stay neutral",
        value: "Not sure",
      },
    ],
    notSureValue: "Not sure",
    autoValue: "Secured NCD",
  },
  {
    id: "securityType",
    label: "Security",
    type: "dropdown",
    required: true,
    tooltip: "Whether assets support repayment.",
    meaning: "Whether the bond has asset support if the issuer defaults.",
    details:
      "Secured means assets may support repayment if the issuer fails. Unsecured means no such backing. Even among secured bonds, the strength of collateral can differ.",
    example:
      "Land-backed and receivables-backed bonds can both be secured but differ in strength.",
    howToChoose:
      "If the listing says secured, choose secured. If it is unclear, use Not sure rather than guessing.",
    backendNote: "Used for recovery estimation.",
    options: ["Secured", "Partially Secured", "Unsecured", "Not sure"],
    notSureValue: "Not sure",
    autoValue: (values) =>
      issuerCatalog[values.issuer]?.securityType || "Not sure",
  },
  {
    id: "tenure",
    label: "Maturity",
    type: "dropdown",
    required: true,
    tooltip: "How long your money will be locked.",
    meaning: "The maturity period of the bond.",
    details:
      "Longer tenure means more uncertainty over time, and exiting early may still be difficult even if the bond is listed.",
    example: "A 2-year goal and a 5-year bond are usually a mismatch.",
    howToChoose:
      "Choose the maturity bucket shown on the platform and make sure it broadly matches your holding horizon.",
    backendNote: "Used in horizon fit scoring.",
    options: ["< 3 years", "3 - 5 years", "5 - 10 years", "> 10 years"],
    notSureValue: "3 - 5 years",
    autoValue: "3 - 5 years",
  },
  {
    id: "interestRate",
    label: "Interest rate",
    type: "percent",
    required: true,
    tooltip: "How much return the bond offers.",
    meaning: "The coupon or yield the bond is offering.",
    details:
      "Higher rates often mean higher risk, not free extra return. Comparing rates across similar bonds helps you judge whether the pricing is attractive or a warning sign.",
    example:
      "A 12% bond usually carries more risk than an 8% bond from a stronger issuer.",
    howToChoose:
      "Copy the rate directly from the listing.",
    backendNote: "Risk-return analysis.",
    min: 4,
    max: 18,
    step: 0.1,
    notSureValue: 9,
    autoValue: (values) => issuerCatalog[values.issuer]?.interestRate || 9,
  },
  {
    id: "payoutType",
    label: "Payout frequency",
    type: "dropdown",
    required: true,
    tooltip: "How you receive returns.",
    meaning: "Whether interest is paid regularly or accumulated until maturity.",
    details:
      "Monthly or quarterly payouts support regular income needs. Cumulative payout means the return is paid at maturity instead.",
    example: "INR 100000 at 9% monthly can generate recurring income, while cumulative waits until maturity.",
    howToChoose:
      "Choose based on how you want to receive returns from this bond.",
    backendNote: "Cashflow matching.",
    options: ["Monthly", "Quarterly", "Annual", "Cumulative", "Not sure"],
    notSureValue: "Quarterly",
    autoValue: "Quarterly",
  },
  {
    id: "liquidity",
    label: "Can you exit early?",
    type: "dropdown",
    required: true,
    tooltip: "Can you exit before maturity?",
    meaning: "The bond's likely exit flexibility before maturity.",
    details:
      "Listed does not always mean easy to sell. Some bonds are technically tradable but still hard to exit in real market conditions.",
    example: "You may struggle to find a buyer even if the bond is listed.",
    howToChoose:
      "Copy the platform indication if available; otherwise use Not sure.",
    backendNote: "Liquidity penalty.",
    options: ["Easy to exit", "Moderate", "Hard to exit", "Not sure"],
    notSureValue: "Not sure",
    autoValue: "Moderate",
  },
  {
    id: "issueSize",
    label: "Issue size",
    type: "dropdown",
    required: false,
    tooltip: "How large the bond issue is.",
    meaning: "The size of the bond issuance.",
    details:
      "Larger issues often attract more participation and scrutiny. Smaller issues may get less attention, though size alone does not guarantee safety.",
    example: "An INR 50 Cr issue and an INR 1000 Cr issue can feel very different in market confidence.",
    howToChoose:
      "This is optional. If the platform shows issue size, choose the matching bucket.",
    backendNote: "Adds a confidence boost when available.",
    options: ["Small", "Medium", "Large", "Not sure"],
    notSureValue: "Not sure",
    autoValue: (values) => issuerCatalog[values.issuer]?.issueSize || "Not sure",
  },
];

export const sampleInputs = {
  amount: 150000,
  horizon: "3 - 5 years",
  riskProfile: "Balanced",
  returnPreference: "Regular Income",
  issuer: "Northstar Utilities",
  issuerType: "PSU / Utility",
  creditRating: "AA",
  instrumentType: "Secured NCD",
  securityType: "Secured",
  tenure: "3 - 5 years",
  interestRate: 8.4,
  payoutType: "Quarterly",
  liquidity: "Moderate",
  issueSize: "Large",
};
