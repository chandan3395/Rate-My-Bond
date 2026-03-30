import { memo } from "react";
import { safeArray } from "../../helpers/errorHandlers";

function NarrativeSection({ analysis }) {
  const narrative = safeArray(analysis.narrative);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        Natural Language Assessment
      </h2>

      <div className="mt-5 space-y-4 text-sm leading-7 text-white/72">
        {analysis.missingRequired.length ? (
          <p>Fill the required fields to unlock the full assessment.</p>
        ) : (
          narrative.map((line) => <p key={line}>{line}</p>)
        )}
      </div>
    </div>
  );
}

export default memo(NarrativeSection);
