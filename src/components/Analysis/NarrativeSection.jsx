import { memo } from "react";
import { safeArray } from "../../helpers/errorHandlers";

function NarrativeSection({ analysis }) {
  const narrative = safeArray(analysis.narrative);
  const summary = analysis.summary || narrative.join(" ");

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        Natural language assessment
      </h2>

      <div className="mt-5 space-y-4 text-sm leading-7 text-white/72">
        {analysis.missingRequired.length ? (
          <p>Fill the required fields to unlock the full assessment.</p>
        ) : (
          <>
            <div className="rounded-2xl border border-white/10 bg-[#103a3b] p-5">
              <p className="text-base leading-8 text-white/78">{summary}</p>
            </div>

            <div className="grid gap-3">
              {narrative.map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/10 bg-[#0d2b2c]/80 px-4 py-3 text-sm text-white/60"
                >
                  {line}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(NarrativeSection);
