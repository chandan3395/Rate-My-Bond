import { memo } from "react";

function HelpBlock({ field }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d2b2c]/70 px-4 py-4 text-sm text-white/70">
      <div className="space-y-4 leading-7">
        <div>
          <p className="font-semibold text-white">Meaning</p>
          <p>{field.meaning}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Explanation</p>
          <p>{field.details}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Example</p>
          <p>{field.example}</p>
        </div>
        <div>
          <p className="font-semibold text-white">How to choose</p>
          <p>{field.howToChoose}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Backend note</p>
          <p>{field.backendNote}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(HelpBlock);
