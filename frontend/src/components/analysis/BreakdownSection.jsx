import { memo } from "react";
import { Link } from "react-router-dom";
import { safeArray } from "../../helpers/errorHandlers";

function getBarColor(score) {
  if (score >= 80) return "bg-[#67d391]";
  if (score >= 50) return "bg-[#f2c66d]";
  return "bg-[#f39a8d]";
}

function BreakdownGroup({ title, items }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
        {title}
      </h3>

      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-[#103a3b] p-4"
        >
          <div className="flex justify-between gap-4 text-sm text-white/72">
            <span>{item.label}</span>
            <span className="font-semibold text-white">{item.score}/100</span>
          </div>

          <div className="mt-3 h-2.5 rounded-full bg-white/10">
            <div
              className={`h-2.5 rounded-full ${getBarColor(item.score)}`}
              style={{ width: `${item.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakdownSection({ analysis }) {
  const qualityItems = safeArray(analysis.bondQualityBreakdown);
  const fitItems = safeArray(analysis.fitBreakdown);

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

      <div className="mt-6 space-y-6">
        <BreakdownGroup title="Bond quality inputs" items={qualityItems} />
        <BreakdownGroup title="Investor fit inputs" items={fitItems} />
      </div>
    </div>
  );
}

export default memo(BreakdownSection);
