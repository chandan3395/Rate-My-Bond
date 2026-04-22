import { memo } from "react";
import { getBondRatingTone } from "../../utils/bondAnalysis";


// different background color for diffrent ranges of score
function getScorePalette(score) {
  if (score >= 80) {
    return {
      ring: "#67d391",
      glow: "from-[#67d391]/25 to-[#b6efc7]/10",
      badge: "bg-[#67d391]/15 text-[#b6efc7]",
      label: "Strong fit",
    };
  }

  if (score >= 50) {
    return {
      ring: "#f2c66d",
      glow: "from-[#f2c66d]/25 to-[#f6dfb2]/10",
      badge: "bg-[#f2c66d]/15 text-[#f6dfb2]",
      label: "Moderate fit",
    };
  }

  return {
    ring: "#f39a8d",
    glow: "from-[#f39a8d]/25 to-[#f7c1b8]/10",
    badge: "bg-[#f39a8d]/15 text-[#f7c1b8]",
    label: "High caution",
  };
}

function ScoreSection({ analysis }) {
  const score = analysis.finalScore ?? 0;  
  const palette = getScorePalette(score);
  const circumference = 2 * Math.PI * 50;
  const strokeOffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${palette.glow} p-6 shadow-soft`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
        Platform view
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={palette.ring}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                Score
              </span>
              <span className="mt-1 text-3xl font-semibold text-white">
                {analysis.finalScore ?? "--"}
              </span>
            </div>
          </div>

          <p className="text-sm text-white/60">Internal rating</p>
          <div>
            <p
              className={`mt-2 text-5xl font-semibold ${getBondRatingTone(
                analysis.ratingBand,
              )}`}
            >
              {analysis.ratingBand}
            </p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${palette.badge}`}
            >
              {palette.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/60">Bond quality</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {analysis.issuerScore}
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
        <>The score blends bond quality with profile fit so the output is easier to act on, not just read.</>

      </div>
    </div>
  );
}

export default memo(ScoreSection);
