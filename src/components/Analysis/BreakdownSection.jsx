import { memo } from "react";
import { Link } from "react-router-dom";
import { safeArray } from "../../helpers/errorHandlers";

function BreakdownSection({ analysis }) {
  const breakdownItems = [
    ...safeArray(analysis.bondQualityBreakdown),
    ...safeArray(analysis.fitBreakdown),
  ];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Analysis Breakdown
        </h2>

        <Link to="/terms" className="text-[#8fd7cf]">
          View terms
        </Link>
      </div>

      <div className="mt-6 space-y-5">
        {breakdownItems.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm text-white/70">
              <span>{item.label}</span>
              <span>{item.score}/100</span>
            </div>

            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-[#8fd7cf]"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(BreakdownSection);
