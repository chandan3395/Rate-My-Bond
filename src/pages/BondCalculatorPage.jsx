import { useCallback, useMemo, useState } from "react";
import AnalysisPanel from "../components/analysis/AnalysisPanel";
import BondDetailsSection from "../components/form/BondDetailsSection";
import UserIntentSection from "../components/form/UserIntentSection";
import CalculatorHeader from "../components/layout/CalculatorHeader";
import { ANALYSIS_PANEL_ID } from "../constants/formConstants";
import { bondDetailFields, userIntentFields } from "../data/bondFormConfig";
import useBondForm from "../hooks/useBondForm";
import { analyzeBond } from "../utils/bondAnalysis";

function BondCalculatorPage() {
  const {
    values,
    updateValue,
    handleAssist,
    clearInputs,
    loadSample,
    requiredCompleted,
    totalRequired,
    hasAnyInputs,
  } = useBondForm();
  const [openHelpId, setOpenHelpId] = useState(null);

  const analysis = useMemo(() => analyzeBond(values), [values]);

  const handlePrimaryAction = useCallback(() => {
    if (!hasAnyInputs) {
      loadSample();
      return;
    }

    document.getElementById(ANALYSIS_PANEL_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hasAnyInputs, loadSample]);

  const handleClearInputs = useCallback(() => {
    clearInputs();
    setOpenHelpId(null);
  }, [clearInputs]);

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CalculatorHeader
          hasAnyInputs={hasAnyInputs}
          onPrimaryAction={handlePrimaryAction}
          onClearInputs={handleClearInputs}
        />

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <UserIntentSection
              fields={userIntentFields}
              values={values}
              onChange={updateValue}
              onAssist={handleAssist}
              openHelpId={openHelpId}
              setOpenHelpId={setOpenHelpId}
              requiredCompleted={requiredCompleted}
              totalRequired={totalRequired}
            />

            <BondDetailsSection
              fields={bondDetailFields}
              values={values}
              onChange={updateValue}
              onAssist={handleAssist}
              openHelpId={openHelpId}
              setOpenHelpId={setOpenHelpId}
            />
          </section>

          <AnalysisPanel analysis={analysis} />
        </div>
      </div>
    </main>
  );
}

export default BondCalculatorPage;
