import { memo } from "react";
import { fieldLabelMap } from "../../constants/formConstants";
import { safeArray } from "../../helpers/errorHandlers";

const accuracyImpactMap = {
  amount: 6,
  horizon: 9,
  riskProfile: 11,
  returnPreference: 7,
  issuer: 12,
  issuerType: 8,
  creditRating: 12,
  instrumentType: 9,
  securityType: 9,
  tenure: 10,
  interestRate: 12,
  payoutType: 8,
  liquidity: 10,
  issueSize: 5,
};

function MissingFieldsSection({ analysis }) {
  const missingRequired = safeArray(analysis.missingRequired);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        Missing Required Fields
      </h2>

      <div className="mt-5">
        {missingRequired.length ? (
          <div className="space-y-3">
            {missingRequired.map((fieldId) => (
              <div
                key={fieldId}
                className="rounded-2xl border border-white/10 bg-[#103a3b] p-4"
              >
                <p className="text-sm font-semibold text-white">
                  Add {fieldLabelMap[fieldId] ?? fieldId}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Improves accuracy by roughly {accuracyImpactMap[fieldId] ?? 6}% and unlocks a clearer recommendation.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-[#8fd7cf]">
            All required fields completed
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(MissingFieldsSection);
