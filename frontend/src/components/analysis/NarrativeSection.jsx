import { memo } from "react";
import { safeArray } from "../../helpers/errorHandlers";

function NarrativeSection({ analysis }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        Score breakdown
      </h2>

      <div className="mt-5 space-y-3">
        {[
          { label: "Issuer strength", value: analysis.issuerScore },
          { label: "Bond structure", value: analysis.structureScore },
          { label: "Liquidity", value: analysis.liquidityScore },
          { label: "Return quality", value: analysis.returnScore },
          { label: "Profile fit", value: analysis.fitScore },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#0d2b2c]/80 px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">{label}</span>
            <span className="text-sm font-semibold text-white">{value}/100</span>
          </div>
        ))}

        <div className="rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-white/60">Expected loss</span>
          <span className="text-sm font-semibold text-white">{(analysis.expectedLoss * 100).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

export default memo(NarrativeSection);
