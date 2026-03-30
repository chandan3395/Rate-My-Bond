import { memo } from "react";
import { getBondRatingTone } from "../../utils/bondAnalysis";

function ScoreSection({ analysis }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#103a3b] to-[#0a2728] p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
        Platform view
      </p>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm text-white/60">Internal rating</p>
          <p
            className={`mt-2 text-5xl font-semibold ${getBondRatingTone(
              analysis.ratingBand,
            )}`}
          >
            {analysis.missingRequired.length ? "--" : analysis.ratingBand}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-white/60">Overall score</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.missingRequired.length ? "Incomplete" : analysis.overallScore}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/60">Bond quality</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {analysis.bondQualityScore}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/60">Profile fit</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {analysis.fitScore}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
        {analysis.missingRequired.length ? (
          <>Complete the missing required fields to unlock the analysis.</>
        ) : (
          <>The system combines bond quality with your profile fit.</>
        )}
      </div>
    </div>
  );
}

export default memo(ScoreSection);
