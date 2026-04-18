import { memo } from "react";
import {
  CALCULATOR_COPY,
  FORM_ACTION_LABELS,
} from "../../constants/formConstants";

function CalculatorHeader({
  hasAnyInputs,
  hasAnalysis,
  currentStep,
  totalSteps,
  onLoadSample,
  onClearInputs,
  onJumpToResults,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          {CALCULATOR_COPY.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {CALCULATOR_COPY.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-white/70">
          {CALCULATOR_COPY.description}
        </p>
        <p className="mt-4 text-sm font-medium text-white/45">
          Guided workflow {currentStep + 1}/{totalSteps}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onLoadSample}
          className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.02] hover:bg-[#9fe5de]"
        >
          {FORM_ACTION_LABELS.loadSample}
        </button>
        {hasAnyInputs && hasAnalysis ? (
          <button
            type="button"
            onClick={onJumpToResults}
            className="rounded-full border border-[#8fd7cf]/20 px-5 py-3 text-sm font-semibold text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
          >
            View results
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClearInputs}
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
        >
          {FORM_ACTION_LABELS.clear}
        </button>
      </div>
    </div>
  );
}

export default memo(CalculatorHeader);
