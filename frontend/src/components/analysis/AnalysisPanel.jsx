import { memo } from "react";
import { ANALYSIS_PANEL_ID } from "../../constants/formConstants";
import BreakdownSection from "./BreakdownSection";
import MissingFieldsSection from "./MissingFieldsSection";
import NarrativeSection from "./NarrativeSection";
import ScoreSection from "./ScoreSection";

function EmptyState({
  requiredCompleted,
  totalRequired,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fd7cf]">
        Result dashboard
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white">
        Your analysis will appear here
      </h2>
      <p className="mt-4 text-base leading-7 text-white/65">
        Complete the guided steps, review the entries, and submit to generate the bond rating dashboard.
      </p>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#103a3b] p-5">
        <p className="text-sm text-white/50">Required completion</p>
        <p className="mt-2 text-4xl font-semibold text-white">
          {requiredCompleted}/{totalRequired}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8fd7cf] to-[#d5f2de]"
            style={{
              width: `${totalRequired ? (requiredCompleted / totalRequired) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fd7cf]">
        Analyzing
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white">
        Building your bond dashboard
      </h2>
      <p className="mt-4 text-base leading-7 text-white/65">
        The analysis engine is translating the submitted entries into a clear risk and fit view.
      </p>

      <div className="mt-8 flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-[#103a3b] p-5">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#8fd7cf]" />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-2/3 rounded-full bg-white/10" />
          <div className="h-3 w-full rounded-full bg-white/10" />
          <div className="h-3 w-4/5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function AnalysisPanel({
  analysis,
  state,
  copyStatus,
  onCopySummary,
  onEditInputs,
  onReset,
  requiredCompleted,
  totalRequired,
  hasPendingChanges,
  onReanalyze,
}) {
  if (state === "loading") {
    return (
      <aside
        id={ANALYSIS_PANEL_ID}
        className="space-y-6 xl:sticky xl:top-28 xl:self-start"
      >
        <LoadingState />
      </aside>
    );
  }

  if (state !== "ready") {
    return (
      <aside
        id={ANALYSIS_PANEL_ID}
        className="space-y-6 xl:sticky xl:top-28 xl:self-start"
      >
        <EmptyState
          requiredCompleted={requiredCompleted}
          totalRequired={totalRequired}
        />
      </aside>
    );
  }

  return (
    <aside
      id={ANALYSIS_PANEL_ID}
      className="space-y-6 xl:sticky xl:top-28 xl:self-start"
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-soft">
        <div className="flex flex-col gap-3">
          {hasPendingChanges ? (
            <div className="rounded-2xl border border-[#f2c66d]/25 bg-[#2b2415] px-4 py-3 text-sm text-[#f6dfb2]">
              Inputs changed after the last run. Re-analyze to refresh the score.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCopySummary}
              className="rounded-full bg-[#8fd7cf] px-4 py-3 text-sm font-semibold text-[#062021] transition hover:bg-[#9fe5de]"
            >
              {copyStatus === "copied"
                ? "Summary copied"
                : copyStatus === "failed"
                  ? "Copy failed"
                  : "Copy summary"}
            </button>
            {hasPendingChanges ? (
              <button
                type="button"
                onClick={onReanalyze}
                className="rounded-full border border-[#8fd7cf]/20 px-4 py-3 text-sm font-semibold text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
              >
                Re-analyze
              </button>
            ) : (
              <button
                type="button"
                onClick={onEditInputs}
                className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Edit inputs
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
            >
              Reset form
            </button>
          </div>
        </div>
      </div>

      <ScoreSection analysis={analysis} />
      <NarrativeSection analysis={analysis} />
      <BreakdownSection analysis={analysis} />
      <MissingFieldsSection analysis={analysis} />
    </aside>
  );
}

export default memo(AnalysisPanel);
