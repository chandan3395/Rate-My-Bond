import { memo } from "react";
import { ANALYSIS_PANEL_ID } from "../../constants/formConstants";
import BreakdownSection from "./BreakdownSection";
import MissingFieldsSection from "./MissingFieldsSection";
import NarrativeSection from "./NarrativeSection";
import ScoreSection from "./ScoreSection";

function AnalysisPanel({ analysis }) {
  return (
    <aside
      id={ANALYSIS_PANEL_ID}
      className="space-y-6 xl:sticky xl:top-28 xl:self-start"
    >
      <ScoreSection analysis={analysis} />
      <NarrativeSection analysis={analysis} />
      <BreakdownSection analysis={analysis} />
      <MissingFieldsSection analysis={analysis} />
    </aside>
  );
}

export default memo(AnalysisPanel);
